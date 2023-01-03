import { ModelVozilaModel } from "./model-vozila.model";

export interface MarkaVozilaModel{
    id: number;
    naziv: string;
    modeli: ModelVozilaModel[]
}