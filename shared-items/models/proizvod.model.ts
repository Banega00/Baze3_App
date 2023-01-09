import { JedinicaMereModel } from './jedinica-mere.model'
import { CenaProizvodaModel } from './cena-proizvoda.model'
export interface ProizvodModel{
    sifra: string;
    procenat_pdv: number;
    naziv: string;
    smestaj: string;
    jedinica_mere_id: number;
    jedinica_mere: JedinicaMereModel;
    cene_proizvoda: CenaProizvodaModel[];
}