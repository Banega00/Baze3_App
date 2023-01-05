import { NextFunction, Request, Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../../../shared-items/status-codes";
import { db } from "../database/connection";
import { sendResponse} from "../utils/send-response";
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { KlijentModel } from '@shared-items/models/klijent.model';

export class MainController{
    constructor() {

    }

    getMarkeIModeleVozila = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const query = `
                        SELECT mv.id, mv.naziv as naziv_marke, m.naziv, m.oznaka, m.id, m.marka_id
                        FROM marka_vozila mv FULL JOIN model m ON m.marka_id=mv.id`
            const db_response = await db.query(query);
            const marke: MarkaVozilaModel[] = [];
            for(const row of db_response.rows){
                const marka = marke.find(marka => row.naziv_marke == marka.naziv);
                if(marka){
                    marka.modeli.push({naziv: row.naziv, id: row.id, oznaka: row.oznaka})
                }else{
                    marke.push({
                        naziv: row.naziv_marke,
                        id: row.marka_id,
                        modeli: [
                            {
                                naziv: row.naziv,
                                id: row.id,
                                oznaka: row.oznaka
                            }
                        ]
                    })
                }
            }
            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: marke})
        }catch(error){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500})
        }
        
    }

    getKlijenti = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const query = `SELECT * FROM klijent`
            const db_response = await db.query(query);
            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows})
        }catch(error){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500})
        }
        
    }

    updateKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const klijent: KlijentModel = request.body; 
            const query = `UPDATE klijent SET ime=$1 , br_lk=$2 WHERE jmbg=$3`
            await db.query(query, [klijent.ime, klijent.br_lk, klijent.jmbg]);
            sendResponse({response, code: SuccessStatusCode.OK, status: 200})
        }catch(error){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500})
        }
        
    }

    addNewKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const klijent: KlijentModel = request.body; 
            const query = `INSERT INTO klijent (jmbg, ime, br_lk) VALUES ($1,$2,$3)`
            await db.query(query, [klijent.jmbg, klijent.ime, klijent.br_lk]);
            sendResponse({response, code: SuccessStatusCode.OK, status: 201})
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
    }

    deleteKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const jmbg: string = request.params.jmbg; 
            const query = `DELETE FROM klijent WHERE jmbg = $1`
            await db.query(query, [jmbg]);
            sendResponse({response, code: SuccessStatusCode.OK, status: 201})
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
    }

    getVozila = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const query = `SELECT v.broj_sasije, v.broj_osiguranja, 
            (registarski_broj).grad, 
            (registarski_broj).oznaka_grada, 
            (registarski_broj).broj,
            v.godiste, v.model_id, v.marka_id,
            mv.id, mv.naziv as naziv_marke, m.naziv, m.oznaka, m.id, m.marka_id
            FROM vozilo v 
            JOIN model m ON v.model_id = m.id  AND v.marka_id = m.marka_id
            JOIN marka_vozila mv ON m.marka_id = mv.id;`;

            
            const db_response = await db.query(query);

            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows})
        }catch(error){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500})
        }
        
    }
}