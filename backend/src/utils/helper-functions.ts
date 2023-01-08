import moment from "moment";
import { db } from "../database/connection";

export function formatDate(date: Date | string | undefined | null) {
    if (!date) return null;

    return moment(date).add(1, 'hour').toDate()
}

function generateVinNumber() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 17; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function generateBrojOsiguranja() {
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function generateGodiste() {
    return Math.floor(Math.random() * (2022 - 1999 + 1)) + 1999;
}

function getModelIMarkaId(){
    const array = [
        [7,1],[6,1],[5,2],[4,2],[3,3],[2,2],[1,3]
    ]

    return array[Math.floor(Math.random() * array.length)];
}

function generateRegistarskiBroj(){
    const array = [
        ['Beograd','BG'],
        ['Niš','NI'],
        ['Kragujevac','KG'],
        ['Novi Sad','NS'],
        ['Užice','UE']
    ]

    const randomElement = array[Math.floor(Math.random() * array.length)];
    randomElement.push(`${randomElement[1]}${generateRegistarskiBrojBroj()}`);
    return randomElement;
}

function generateRegistarskiBrojBroj(){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    if (i < 4) {
        result += characters.charAt(Math.floor(Math.random() * 10) + 26);
    } else {
        result += characters.charAt(Math.floor(Math.random() * 26));
    }
  }
  return result;
}

export async function insertMockVehicles(n: number) {
    try{
        for (let i = 0; i < n; i++) {
            const [model_id, marka_id] = getModelIMarkaId();
            const broj_sasije = generateVinNumber();
            const broj_osiguranja = generateBrojOsiguranja();
            const godiste = generateGodiste();
            const [grad, oznaka_grada, broj] = generateRegistarskiBroj();
    
            db.query('BEGIN')
    
            const query = `INSERT INTO Vozilo(broj_sasije, broj_osiguranja, registarski_broj, godiste, model_id, marka_id)
            VALUES($1,$2,ROW($3,$4,$5),$6,$7,$8);`;
    
            const parameters = [broj_sasije, broj_osiguranja, grad, oznaka_grada, broj, godiste, model_id, marka_id];
            
            await db.query(query, parameters);

            await new Promise(resolve => setTimeout(resolve, 200));

    
            await db.query('INSERT INTO servisna_knjiga(broj_sasije) VALUES($1)',[broj_sasije])

            await new Promise(resolve => setTimeout(resolve, 200));

            console.log(`UBACIO ${i}`)
        }
        db.query('COMMIT')
    }catch(error){
        console.log(error)
        db.query('ROLLBACK')
    }
    
}