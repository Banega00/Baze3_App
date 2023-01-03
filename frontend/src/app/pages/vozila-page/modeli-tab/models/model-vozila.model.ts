import { MarkaVozilaModel } from "./marka-vozila.model";

export interface ModelVozilaModel{
    id: number;
    naziv: string;
    oznaka: string;
    marka?: MarkaVozilaModel
}