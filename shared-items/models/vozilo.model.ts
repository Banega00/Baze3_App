import { MarkaVozilaModel } from './marka-vozila.model';
import { ModelVozilaModel } from './model-vozila.model';

export interface VoziloModel{
    broj_sasije: string;
    original_broj_sasije: string;
    
    broj_osiguranja: string;
    godiste: number;
    model_id: number;
    marka_id: number;

    marka?: MarkaVozilaModel;
    model?: ModelVozilaModel;
    model_i_marka?: string;


    //registarski broj
    broj: string;
    grad:string;
    oznaka_grada: string;
    
}