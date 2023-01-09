import { ValutaModel } from './valuta.model'
export interface CenaProizvodaModel{
    id: number;
    proizvod_id: string;
    valuta_id: number;
    valuta: ValutaModel;
    iznos: number;
    datum_od: Date;
    datum_do: Date;
}