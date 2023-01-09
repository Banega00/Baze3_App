import { ProizvodModel } from './proizvod.model'
export interface StavkaRacunaModel{
    rb: number;
    racun_id?: number;
    kolicina: number;
    procenat_rabat: number;
    proizvod: ProizvodModel;
    proizvod_id: string;
}