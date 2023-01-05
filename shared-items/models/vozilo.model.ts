import { MarkaVozilaModel } from './marka-vozila.model';
import { ModelVozilaModel } from './model-vozila.model';

export interface VoziloModel{
    broj_sasije: string;
    broj_osiguranja: string;
    godiste: number;
    model_id: number;
    marka_vozila: MarkaVozilaModel;
    model_vozila: ModelVozilaModel;
    marka_id: number;

    //registarski broj
    broj: string;
    grad:string;
    oznaka_grada: string;
    
}