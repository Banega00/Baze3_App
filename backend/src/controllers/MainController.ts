import { NextFunction, Request, Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../../../shared-items/status-codes";
import { db } from "../database/connection";
import { sendResponse} from "../utils/send-response";
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';

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
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
        
    }

    getKlijenti = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const query = `SELECT * FROM klijent;`
            const db_response = await db.query(query);
            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows})
        }catch(error: any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
        
    }

    updateKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const klijent: KlijentModel = request.body; 
            const query = `UPDATE klijent SET ime=$1 , br_lk=$2, jmbg=$3 WHERE jmbg = $4`
            await db.query(query, [klijent.ime, klijent.br_lk, klijent.jmbg, klijent.original_jmbg]);
            sendResponse({response, code: SuccessStatusCode.OK, status: 200})
        }catch(error: any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
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

            db_response.rows = db_response.rows.map(row =>{
                row.marka = {
                    id: row.marka_id,
                    naziv: row.naziv_marke
                }

                row.model = {
                    id: row.model_id,
                    naziv: row.naziv
                }

                return row;
            })

            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows})
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
        
    }
    saveVozilo = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const vozilo: VoziloModel = request.body;
            let query = `SELECT * FROM vozilo WHERE broj_sasije = $1`;

            
            
            let db_response = await db.query(query, [vozilo.broj_sasije]);

            if(db_response.rows.length >= 1){
                query = `
                UPDATE vozilo
                SET broj_sasije=$1, broj_osiguranja=$2, registarski_broj=ROW($3,$4,$5), 
                godiste=$6, model_id=$7, marka_id=$8 
                WHERE broj_sasije=$9;`;

                db_response = await db.query(query, [vozilo.broj_sasije, vozilo.broj_osiguranja,
                vozilo.grad, vozilo.oznaka_grada, vozilo.broj,
                vozilo.godiste, vozilo.model_id, vozilo.marka_id,
                vozilo.original_broj_sasije]);
            }else{
                query = `INSERT INTO vozilo(broj_sasije, broj_osiguranja, registarski_broj,
                    godiste, model_id, marka_id)
                    VALUES($1,$2,ROW($3,$4,$5),$6,$7,$8)`

                db_response = await db.query(query, [vozilo.broj_sasije, vozilo.broj_osiguranja,
                vozilo.grad, vozilo.oznaka_grada, vozilo.broj,
                vozilo.godiste, vozilo.model_id, vozilo.marka_id]);

            }

            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows})
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
        
    }

    deleteVozilo = async (request: Request, response: Response, next: NextFunction) => {
        try{
            const broj_sasije = request.params.broj_sasije;
            const query = `DELETE FROM vozilo WHERE broj_sasije=$1`;

            const db_response = await db.query(query,[broj_sasije]);

            if(db_response.rowCount <= 0) {
                return sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 404, message: `Vozilo sa brojem šasije: ${broj_sasije} ne postoji`})
            }

            sendResponse({response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rowCount})
        }catch(error:any){
            console.log(error);
            sendResponse({response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message})
        }
        
    }
}