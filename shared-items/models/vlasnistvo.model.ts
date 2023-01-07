export interface VlasnistvoModel{
    broj_sasije: string;
    datum_od: string | Date | null;
    datum_do: string | Date | null;
    rb: number
    ime_vlasnika: string;
    servisna_knjiga_id: number;
    klijent_id: string;
    original_klijent_id: string;
}