import { StavkaRacunaModel } from './stavka-racuna.model'
export interface RacunModel{
    id: number;
    datum_izdavanja: Date;
    datum_prometa: Date;
    ponuda_id: number;
    radnik_fakturisao: any;
    radnik_naplatio: any;
    mesto_izdavanja: any;
    mesto_prometa: any;
    ukupan_iznos: number;
    stavke_racuna: StavkaRacunaModel[]
}