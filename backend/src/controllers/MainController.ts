import { NextFunction, Request, Response } from "express";
import { ErrorStatusCode, SuccessStatusCode } from "../../../shared-items/status-codes";
import { db } from "../database/connection";
import { sendResponse } from "../utils/send-response";
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
import { RadnikModel } from '@shared-items/models/radnik.model';
import { ProizvodModel } from '@shared-items/models/proizvod.model';
import { RacunModel } from '@shared-items/models/racun.model';
import { formatDate } from "../utils/helper-functions";
import { StavkaRacunaModel } from "@shared-items/models/stavka-racuna.model";

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
            let {godiste_od, godiste_do, broj_sasije} = request.query;
            broj_sasije = broj_sasije ? `${broj_sasije}%` : '%'
            const params:any[] = [godiste_od ?? 0, godiste_do ?? 3000, broj_sasije];

            let query = `SELECT v.broj_sasije, v.broj_osiguranja, 
            (registarski_broj).grad, 
            (registarski_broj).oznaka_grada, 
            (registarski_broj).broj,
            v.godiste, v.model_id, v.marka_id,
            sk.id as servisna_knjiga_id,
            mv.id, mv.naziv as naziv_marke, m.naziv, m.oznaka, m.id, m.marka_id
            FROM vozilo v 
            JOIN model m ON v.model_id = m.id  AND v.marka_id = m.marka_id
            JOIN marka_vozila mv ON m.marka_id = mv.id
            LEFT JOIN servisna_knjiga sk ON sk.broj_sasije = v.broj_sasije
            WHERE godiste >= $1
            AND godiste <= $2
            AND v.broj_sasije LIKE $3`;


            const db_response = await db.query(query, params);

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
                vlasnistvo.klijent_id, formatDate(vlasnistvo.datum_od), formatDate(vlasnistvo.datum_do), vlasnistvo.ime_vlasnika])

                await db.query('COMMIT')
            } else {
                query = `UPDATE vlasnistvo 
                    SET datum_od=$1, datum_do=$2
                    WHERE rb=$3 AND servisna_knjiga_id=$4 AND broj_sasije=$5 AND klijent_id=$6`

                const parameters = [formatDate(vlasnistvo.datum_od), formatDate(vlasnistvo.datum_do),
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

    getIzvestaji = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const ulica = request.body;
            let query = `SELECT si.*, r1.ime_prezime as radnik_isporucio, r2.ime_prezime as radnik_referisao
            FROM servisni_izvestaj si 
            JOIN radnik r1 ON si.radnik_isporucio=r1.jmbg
            JOIN radnik r2 ON si.radnik_referisao=r2.jmbg`;

            let db_response = await db.query(query)

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    updateIzvestaj = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {izvestaj_id, promena_za} = request.body;
            let query = `SELECT increase_antifriz_tacka_mrz_by_n($1,$2)`;

            let db_response = await db.query(query,[promena_za, izvestaj_id])

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getRadniNalozi = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {izvestaj_id, promena_za} = request.body;
            let query = `
            SELECT rn.*, r1.ime_prezime as radnik_primio, r2.ime_prezime as radnik_zaduzen
            FROM radni_nalog_view rn
            JOIN radnik r1 ON r1.jmbg = rn.radnik_primio
            JOIN radnik r2 ON r2.jmbg = rn.radnik_zaduzen
            ORDER BY rn.id DESC`;

            let db_response = await db.query(query)

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }
    deleteRadniNalog = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            let query = `DELETE FROM radni_nalog WHERE id=$1`;

            let db_response = await db.query(query,[id]);

            if(db_response.rowCount < 1){
                sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 404, message: `Radni nalog sa id:${id} nije pornađen` })
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    createRadniNalog = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const radni_nalog = request.body;
            const query = `INSERT INTO radni_nalog_view(datum_prijem, servisna_knjiga_id, 
                broj_sasije, radnik_primio, radnik_zaduzen,
               km_prijem, km_isporuka, datum_odobrenja, odobreno_putem,
               osnovni_pregled, spakovati_stare_delove, napomena)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`

            const params = [formatDate(radni_nalog.datum_prijem), radni_nalog.vozilo.servisna_knjiga_id, radni_nalog.vozilo.broj_sasije,
            radni_nalog.radnik_primio.jmbg, radni_nalog.radnik_zaduzen.jmbg, radni_nalog.km_prijem, 
            radni_nalog.km_isporuka, formatDate(radni_nalog.datum_odobrenja), radni_nalog.odobreno_putem,
            radni_nalog.osnovni_pregled, radni_nalog.spakovati_stare_delove, radni_nalog.napomena]

            let db_response = await db.query(query,params);

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getRadnici = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT * FROM radnik JOIN pozicija ON pozicija.id = radnik.pozicija_id;`;

            let db_response = await db.query(query);

            // db_response.rows = db_response.rows.map(row => {
            //     row.pozicija = { id: row.pozicija_id, naziv: row.naziv};
            //     return row;
            // })

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getPonude = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT * FROM ponuda_klijentu ORDER BY id DESC`;

            let db_response = await db.query(query);

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deletePonuda = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id;
            let query = `DELETE FROM ponuda_klijentu WHERE id=$1`;

            let db_response = await db.query(query,[id]);

            if(db_response.rowCount < 1){
                sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 404, message: `Ponuda sa id:${id} nije pornađen` })
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    savePonuda = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const ponuda =  request.body;
            let query = ''
            let params:any[] = [];
            if(ponuda.isNew){
                query = `INSERT INTO ponuda_klijentu(datum, vazi_dana, 
                    rok_isporuke, radni_nalog_id, radnik_izdao,
                   ime_prezime_izdavaoca)
                   VALUES ($1,$2,$3,$4,$5,$6);`
    
                params = [formatDate(ponuda.datum), ponuda.vazi_dana, formatDate(ponuda.rok_isporuke), 
                    ponuda.radni_nalog.id, ponuda.radnik_izdao.jmbg, ponuda.radnik_izdao.ime_prezime]
            }else{

            }

            let db_response = await db.query(query,params);

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getPozicije = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT * FROM pozicija`;

            let db_response = await db.query(query);

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    updateRadnik = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const radnik: RadnikModel = request.body;
            const query = `UPDATE radnik SET ime_prezime=$1 , br_lk=$2, jmbg=$3, pozicija_id=$4 WHERE jmbg = $5`
            await db.query(query, [radnik.ime_prezime, radnik.br_lk, radnik.jmbg, radnik.pozicija!.id, radnik.original_jmbg]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteRadnik = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const jmbg: string = request.params.jmbg;
            const query = `DELETE FROM radnik WHERE jmbg = $1`
            await db.query(query, [jmbg]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 201 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    addNewRadnik = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const radnik: RadnikModel = request.body;
            const query = `INSERT INTO radnik(ime_prezime, br_lk, jmbg, pozicija_id) VALUES ($1,$2,$3,$4)`
            await db.query(query, [radnik.ime_prezime, radnik.br_lk, radnik.jmbg, radnik.pozicija!.id]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getProizvodi = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT p.sifra, aktuelna_cena(p.sifra) as aktuelna_cena, p.procenat_pdv, p.naziv, p.smestaj,
            p.jedinica_mere_id, cp.id as cena_proizvoda_id, cp.valuta_id, cp.iznos, cp.datum_od, cp.datum_do,
            v.naziv as valuta_naziv, v.id as valuta_id, v.oznaka as valuta_oznaka,
            jm.naziv as jedinica_mere_naziv, jm.oznaka as jedinica_mere_oznaka, jm.mera_za
            FROM proizvod p 
            JOIN cena_proizvoda cp ON cp.proizvod_id = p.sifra
            JOIN jedinica_mere jm ON jm.id = p.jedinica_mere_id
            JOIN valuta v ON cp.valuta_id = v.id;`;

            let db_response = await db.query(query);

            const proizvodi: ProizvodModel[] = []

            for(const row of db_response.rows){
                const proizvod = proizvodi.find(proizvod => proizvod.sifra == row.sifra);

                if(proizvod){
                    proizvod.cene_proizvoda!.push({
                        datum_do: row.datum_od,
                        datum_od: row.datum_do,
                        id: row.cena_proizvoda_id,
                        iznos: row.iznos,
                        proizvod_id: row.sifra,
                        valuta_id: row.valuta_id,
                        valuta: { id: row.valuta_id, naziv: row.valuta_naziv, oznaka: row.valuta_oznaka}
                    })
                }else{
                    proizvodi.push({
                        aktuelna_cena: row.aktuelna_cena,
                        cene_proizvoda: [{
                            datum_do: row.datum_od,
                            datum_od: row.datum_do,
                            id: row.cena_proizvoda_id,
                            iznos: row.iznos,
                            proizvod_id: row.sifra,
                            valuta_id: row.valuta_id,
                            valuta: { id: row.valuta_id, naziv: row.valuta_naziv, oznaka: row.valuta_oznaka}
                        }],
                        jedinica_mere: {
                            id: row.jedinica_mere_id,
                            mera_za: row.mera_za,
                            naziv: row.jedinica_mere_naziv,
                            oznaka: row.jedinica_mere_oznaka
                        },
                        jedinica_mere_id: row.jedinica_mere_id,
                        naziv: row.naziv,
                        procenat_pdv: row.procenat_pdv,
                        sifra: row.sifra,
                        smestaj: row.smestaj
                    })
                }
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: proizvodi })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getJediniceMere = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT * FROM jedinica_mere;`;

            let db_response = await db.query(query);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getValute = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `SELECT * FROM valuta;`;

            let db_response = await db.query(query);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: db_response.rows })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    getRacuni = async (request: Request, response: Response, next: NextFunction) => {
        try {
            let query = `
            SELECT r.id, r.datum_izdavanja, r.datum_prometa, r.ponuda_id,
            radnik_f.ime_prezime AS radnik_fakturisao_ime,
            radnik_n.ime_prezime AS radnik_naplatio_ime,
            radnik_n.jmbg AS radnik_naplatio_jmbg,
            radnik_n.jmbg AS radnik_naplatio_jmbg,
            r.ukupan_iznos,
            mesto_i.naziv as mesto_izdavanja,
            mesto_p.naziv as mesto_prometa,
            sr.rb, sr.racun_id, sr.kolicina, sr.procenat_rabat,
            p.sifra, p.procenat_pdv, p.naziv, p.smestaj,
            p.jedinica_mere_id, cp.id as cena_proizvoda_id, cp.valuta_id, cp.iznos, cp.datum_od, cp.datum_do,
            v.naziv as valuta_naziv, v.id as valuta_id, v.oznaka as valuta_oznaka,
            jm.naziv as jedinica_mere_naziv, jm.oznaka as jedinica_mere_oznaka, jm.mera_za
            FROM racun r 
            JOIN stavka_racuna sr ON sr.racun_id=id
            JOIN proizvod p ON sr.proizvod_id = p.sifra
            JOIN cena_proizvoda cp ON cp.proizvod_id = p.sifra
            JOIN jedinica_mere jm ON jm.id = p.jedinica_mere_id
            JOIN valuta v ON cp.valuta_id = v.id
            JOIN radnik radnik_f ON radnik_f.jmbg=r.radnik_fakturisao
            JOIN radnik radnik_n ON radnik_n.jmbg=r.radnik_naplatio
            JOIN grad mesto_i ON mesto_i.id = r.mesto_izdavanja_grad AND mesto_i.drzava_id = r.mesto_izdavanja_drzava
            JOIN grad mesto_p ON mesto_p.id = r.mesto_prometa_grad AND mesto_p.drzava_id = r.mesto_prometa_drzava
			WHERE r.datum_prometa BETWEEN cp.datum_od AND COALESCE(cp.datum_do, NOW());`;

            let db_response = await db.query(query);

            const racuni: RacunModel[] = []

            for(const row of db_response.rows){
                const racun = racuni.find(racun => racun.id == row.id);

                const stavka_racuna:StavkaRacunaModel = {
                        kolicina: row.kolicina,
                        proizvod_id: row.sifra,
                        proizvod: {
                            cena: row.iznos,
                            valuta: {
                                id: 0,
                                naziv: row.valuta_naziv,
                                oznaka: row.valuta_oznaka
                            },
                            naziv: row.naziv,
                            smestaj: row.smestaj,
                            sifra: row.sifra,
                            procenat_pdv: row.procenat_pdv,
                            jedinica_mere_id: row.jedinica_mere_id,
                            jedinica_mere:{
                                id: row.jedinica_mere_id,
                                oznaka: row.jedinica_mere_oznaka,
                                naziv: row.jedinica_mere_naziv,
                                mera_za: row.mera_za
                            }
                        },
                        rb: row.rb,
                        racun_id: row.id,
                        procenat_rabat: row.procenat_rabat,
                    }

                if(racun){
                    racun.stavke_racuna.push(stavka_racuna)
                }else{
                    racuni.push({
                        id: row.id,
                        stavke_racuna: [stavka_racuna],
                        datum_izdavanja: row.datum_izdavanja,
                        datum_prometa: row.datum_prometa,
                        mesto_izdavanja: row.mesto_izdavanja,
                        mesto_prometa: row.mesto_prometa,
                        radnik_fakturisao: {
                            ime_prezime: row.radnik_fakturisao_ime,
                            jmbg: row.radnik_fakturisao_jmbg
                        },

                        radnik_naplatio: {
                            ime_prezime: row.radnik_naplatio_ime,
                            jmbg: row.radnik_naplatio_jmbg
                        },
                        ponuda_id: row.ponuda_id,
                        ukupan_iznos: row.ukupan_iznos
                    })
                }
            }

            sendResponse({ response, code: SuccessStatusCode.OK, status: 200, payload: racuni })
        } catch (error: any) {
            // await db.query('ROLLBACK')
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteRacun = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const stavka_racuna = request.body;
            const query = `DELETE FROM racun WHERE racun_id = $1;`
            await db.query(query, [stavka_racuna.racun_id]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    deleteStavka = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const stavka_racuna = request.body;
            const query = `DELETE FROM stavka_racuna WHERE rb = $1 AND racun_id = $2;`
            await db.query(query, [stavka_racuna.rb, stavka_racuna.racun_id]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }

    dodajStavku = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const stavka_racuna = request.body;

            let rb = (await db.query(`SELECT MAX(rb) FROM stavka_racuna WHERE racun_id=$1`,[stavka_racuna.racun_id])).rows[0].max;

            rb++;

            const query = `
            INSERT INTO stavka_racuna(rb, racun_id, kolicina, procenat_rabat, proizvod_id) 
            VALUES ($1,$2,$3,$4,$5);`
            await db.query(query, [rb, stavka_racuna.racun_id, stavka_racuna.kolicina, stavka_racuna.procenat_raba ?? 0, stavka_racuna.proizvod.sifra]);
            sendResponse({ response, code: SuccessStatusCode.OK, status: 200 })
        } catch (error: any) {
            console.log(error);
            sendResponse({ response, code: ErrorStatusCode.UNKNOWN_ERROR, status: 500, message: error.message })
        }
    }
}