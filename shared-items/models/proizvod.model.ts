import { JedinicaMereModel } from './jedinica-mere.model'
import { CenaProizvodaModel } from './cena-proizvoda.model'
import { ValutaModel } from './valuta.model';
export interface ProizvodModel{
    sifra: string;
    procenat_pdv: number;
    naziv: string;
    smestaj: string;
    aktuelna_cena?: number;
    jedinica_mere_id: number;
    jedinica_mere: JedinicaMereModel;
    cena?:number;
    valuta?: ValutaModel;
    cene_proizvoda?: CenaProizvodaModel[];
}