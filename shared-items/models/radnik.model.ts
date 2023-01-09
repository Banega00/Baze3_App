export interface RadnikModel{
    jmbg: string;
    ime_prezime: string;
    br_lk: string;
    original_jmbg?: string;
    pozicija?: {id: number, naziv: string},
    pozicija_id?: number;
    naziv?: string;
}