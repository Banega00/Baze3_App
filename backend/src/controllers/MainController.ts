import { NextFunction, Request, Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../../../shared-items/status-codes";
import { db } from "../database/connection";
import { sendResponse} from "../utils/send-response";
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';

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
}