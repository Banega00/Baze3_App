import { NextFunction, Request, Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../../../shared-items/status-codes";
import { db } from "../database/connection";
import { sendResponse } from "../utils/send-response";
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
import { formatDate } from "../utils/helper-functions";

export class MainController {
    constructor() {

    }

    getMarkeIModeleVozila = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const query = `
                        SELECT mv.id, mv.naziv as naziv_marke, m.naziv, m.oznaka, m.id, m.marka_id
                        FROM marka_vozila mv FULL JOIN model m ON m.marka_id=mv.id`
            const db_response = await db.query(query);
            const marke: MarkaVozilaModel[] = [];
            for (const row of db_response.rows) {
                const marka = marke.find(marka => row.naziv_marke == marka.naziv);
                if (marka) {
                    marka.modeli.push({ naziv: row.naziv, id: row.id, oznaka: row.oznaka })
                } else {
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
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: marke })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }

    }

    getKlijenti = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const query = `SELECT * FROM klijent;`
            const db_response = await db.query(query);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }

    }

    updateKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const klijent: KlijentModel = request.body;
            const query = `UPDATE klijent SET ime=$1 , br_lk=$2, jmbg=$3 WHERE jmbg = $4`
            await db.query(query, [klijent.ime, klijent.br_lk, klijent.jmbg, klijent.original_jmbg]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    addNewKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const klijent: KlijentModel = request.body;
            const query = `INSERT INTO klijent (jmbg, ime, br_lk) VALUES ($1,$2,$3)`
            await db.query(query, [klijent.jmbg, klijent.ime, klijent.br_lk]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 201 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteKlijent = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const jmbg: string = request.params.jmbg;
            const query = `DELETE FROM klijent WHERE jmbg = $1`
            await db.query(query, [jmbg]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 201 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getVozila = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const query = `SELECT v.broj_sasije, v.broj_osiguranja, 
            (registarski_broj).grad, 
            (registarski_broj).oznaka_grada, 
            (registarski_broj).broj,
            v.godiste, v.model_id, v.marka_id,
            sk.id as servisna_knjiga_id,
            mv.id, mv.naziv as naziv_marke, m.naziv, m.oznaka, m.id, m.marka_id
            FROM vozilo v 
            JOIN model m ON v.model_id = m.id  AND v.marka_id = m.marka_id
            JOIN marka_vozila mv ON m.marka_id = mv.id
            LEFT JOIN servisna_knjiga sk ON sk.broj_sasije = v.broj_sasije;`;



            const db_response = await db.query(query);

            db_response.rows = db_response.rows.map(row => {
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

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }

    }
    saveVozilo = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const vozilo: VoziloModel = request.body;
            let query = `SELECT * FROM vozilo WHERE broj_sasije = $1`;



            let db_response = await db.query(query, [vozilo.original_broj_sasije]);

            if (db_response.rows.length >= 1) {
                query = `
                UPDATE vozilo
                SET broj_sasije=$1, broj_osiguranja=$2, registarski_broj=ROW($3,$4,$5), 
                godiste=$6, model_id=$7, marka_id=$8 
                WHERE broj_sasije=$9;`;

                db_response = await db.query(query, [vozilo.broj_sasije, vozilo.broj_osiguranja,
                vozilo.grad, vozilo.oznaka_grada, vozilo.broj,
                vozilo.godiste, vozilo.model_id, vozilo.marka_id,
                vozilo.original_broj_sasije]);
            } else {
                query = `INSERT INTO vozilo(broj_sasije, broj_osiguranja, registarski_broj,
                    godiste, model_id, marka_id)
                    VALUES($1,$2,ROW($3,$4,$5),$6,$7,$8)`

                db_response = await db.query(query, [vozilo.broj_sasije, vozilo.broj_osiguranja,
                vozilo.grad, vozilo.oznaka_grada, vozilo.broj,
                vozilo.godiste, vozilo.model_id, vozilo.marka_id]);

            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }

    }

    deleteVozilo = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const broj_sasije = request.params.broj_sasije;
            const query = `DELETE FROM vozilo WHERE broj_sasije=$1`;

            const db_response = await db.query(query, [broj_sasije]);

            if (db_response.rowCount <= 0) {
                return sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 404, message: `Vozilo sa brojem šasije: ${broj_sasije} ne postoji` })
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rowCount })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }

    }

    getVlasnistva = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const query = `SELECT *
            FROM vlasnistvo v RIGHT JOIN vozilo ON vozilo.broj_sasije = v.broj_sasije`;

            const db_response = await db.query(query);

            const vlasnistvaPoVozilu: any = {};

            db_response.rows.forEach(row => {

                if (vlasnistvaPoVozilu[row.broj_sasije]) {
                    if (row.klijent_id == null) return;
                    vlasnistvaPoVozilu[row.broj_sasije].push(row);
                } else {
                    if (row.klijent_id == null) {
                        vlasnistvaPoVozilu[row.broj_sasije] = [];
                    } else {
                        vlasnistvaPoVozilu[row.broj_sasije] = [row];
                    }
                }

            })

            for (const broj_sasije in vlasnistvaPoVozilu) {
                const vlasnistvaNiz = vlasnistvaPoVozilu[broj_sasije].sort((el1: any, el2: any) => {
                    return el2.datum_od - el1.datum_od;
                })
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: vlasnistvaPoVozilu })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteVlasnistvo = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const vlasnistvo: VlasnistvoModel = request.body;
            const query = `DELETE FROM vlasnistvo 
            WHERE rb=$1 AND servisna_knjiga_id=$2 AND broj_sasije=$3 AND klijent_id=$4`;

            const db_response = await db.query(query, [vlasnistvo.rb, vlasnistvo.servisna_knjiga_id, vlasnistvo.broj_sasije, vlasnistvo.klijent_id])

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    saveVlanistvo = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const vlasnistvo: (VlasnistvoModel & { isEdit: boolean, isNew?: boolean }) = request.body;

            vlasnistvo.datum_od = formatDate(vlasnistvo.datum_od)
            vlasnistvo.datum_do = formatDate(vlasnistvo.datum_do)

            let query = '';
            await db.query('BEGIN')

            if (vlasnistvo.isNew) {
                //Proveri da li klijent postoji
                query = 'SELECT * FROM klijent WHERE jmbg = $1;';

                let db_response = await db.query(query, [vlasnistvo.klijent_id]);

                if (db_response.rows.length <= 0) {
                    //Klijent ne postoji
                    query = 'INSERT INTO klijent(jmbg, ime) VALUES($1,$2);';
                    db_response = await db.query(query, [vlasnistvo.klijent_id, vlasnistvo.ime_vlasnika]);
                }

                query = `SELECT sk.id FROM vozilo JOIN servisna_knjiga sk ON sk.broj_sasije = vozilo.broj_sasije
                    WHERE vozilo.broj_sasije = $1`;

                db_response = await db.query(query, [vlasnistvo.broj_sasije]);
                const servisna_knjiga_id = db_response.rows[0]?.id;

                if (!servisna_knjiga_id) {
                    throw new Error('Vozilo nema servisnu knjigu')
                }

                vlasnistvo.servisna_knjiga_id = servisna_knjiga_id

                //Proveri da li je taj klijent vec imao vlasnistva zbog rb-a
                query = `SELECT * FROM vlasnistvo WHERE servisna_knjiga_id=$1 AND broj_sasije=$2 AND klijent_id=$3;`
                db_response = await db.query(query, [vlasnistvo.servisna_knjiga_id, vlasnistvo.broj_sasije, vlasnistvo.klijent_id])

                const rb = db_response.rows.length + 1;

                query = `
                INSERT INTO vlasnistvo(rb, servisna_knjiga_id, broj_sasije,
                    klijent_id, datum_od, datum_do, ime_vlasnika)
                    VALUES($1,$2,$3,$4,$5,$6,$7)`

                db_response = await db.query(query, [vlasnistvo.rb, vlasnistvo.servisna_knjiga_id, vlasnistvo.broj_sasije,
                vlasnistvo.klijent_id, vlasnistvo.datum_od, vlasnistvo.datum_do, vlasnistvo.ime_vlasnika])

                await db.query('COMMIT')
            } else {
                query = `UPDATE vlasnistvo 
                    SET datum_od=$1, datum_do=$2
                    WHERE rb=$3 AND servisna_knjiga_id=$4 AND broj_sasije=$5 AND klijent_id=$6`

                const parameters = [vlasnistvo.datum_od, vlasnistvo.datum_do,
                vlasnistvo.rb, vlasnistvo.servisna_knjiga_id, vlasnistvo.broj_sasije,
                vlasnistvo.klijent_id]

                const db_response = await db.query(query, parameters)

                await db.query('COMMIT')
            }


            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getUlice = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT u.id, u.naziv, u.grad_id, u.drzava_id,
            g.naziv as grad, d.naziv as drzava 
            FROM ulice_srbija u 
            JOIN drzava d ON d.id = u.drzava_id JOIN grad g ON g.id = u.grad_id AND u.drzava_id=g.drzava_id`;
            const ulice_srbija = (await db.query(query)).rows;

            query = `SELECT u.id, u.naziv, u.grad_id, u.drzava_id,
            g.naziv as grad, d.naziv as drzava 
            FROM ulice_hrvatska u 
            JOIN drzava d ON d.id = u.drzava_id JOIN grad g ON g.id = u.grad_id AND u.drzava_id=g.drzava_id`;
            const ulice_hrvatska = (await db.query(query)).rows;

            query = `SELECT u.id, u.naziv, u.grad_id, u.drzava_id,
            g.naziv as grad, d.naziv as drzava 
            FROM ulice_makedonija u 
            JOIN drzava d ON d.id = u.drzava_id JOIN grad g ON g.id = u.grad_id AND u.drzava_id=g.drzava_id`;
            const ulice_makedonija = (await db.query(query)).rows;

            query = `SELECT u.id, u.naziv, u.grad_id, u.drzava_id,
                g.naziv as grad, d.naziv as drzava 
                FROM ulica_ostale_drzave u 
                JOIN drzava d ON d.id = u.drzava_id JOIN grad g ON g.id = u.grad_id AND u.drzava_id=g.drzava_id`;

            const ulice_ostale_drzave = (await db.query(query)).rows;

            query = 'SELECT * FROM grad;'
            const gradovi = (await db.query(query)).rows;

            query = 'SELECT * FROM drzava;'
            const drzave = (await db.query(query)).rows;

            const responseData = {
                ulice: {
                    ulice_srbija,
                    ulice_hrvatska,
                    ulice_makedonija,
                    ulice_ostale_drzave
                },
                gradovi,
                drzave
            }



            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: responseData })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteUlica = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const ulica = request.body;
            let query = `DELETE FROM ulica WHERE id=$1 AND grad_id=$2 AND drzava_id=$3`;
            db.query(query,[ulica.id, ulica.grad_id, ulica.drzava_id])

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    saveUlica = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const ulica = request.body;
            let query = `SELECT id FROM ulica WHERE grad_id=$1 AND drzava_id=$2 ORDER BY id DESC LIMIT 1`;

            let db_response = await db.query(query,[ulica.grad.id, ulica.drzava.id])

            const id = db_response.rows[0].id;

            query = `INSERT INTO ulica(id,naziv,grad_id,drzava_id) VALUES($1,$2,$3,$4)`;
            await db.query(query,[id+1, ulica.naziv, ulica.grad.id, ulica.drzava.id])

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }
}