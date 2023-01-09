import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-radni-nalozi',
  templateUrl: './radni-nalozi.component.html',
  styleUrls: ['./radni-nalozi.component.css']
})
export class RadniNaloziComponent {
  moment: any = moment;
  radniNalozi:any[];
  vozila:any[];
  radnici: any[];

  kreiranjeNovogRN: boolean = false;
  noviRadniNalog:any = {};

  selectedVozila:typeof this.vozila;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getRadniNalozi();
    this.getRadnici();
    this.getVozila();
  }

  getVozila() {
    this.httpService.getVozila()
    .subscribe({
      next: (data) => {
        this.vozila = data.payload!;
        this.selectedVozila = this.vozila;
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dovlačenja vozila', error.error.message);
      }
    })
  }

  getRadniNalozi() {
    this.httpService.getRadniNalozi()
    .subscribe({
      next: (data) => {
        this.radniNalozi = data.payload;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom prikazivanja radnih naloga', error.error.message);
      }
    })
  }

  getRadnici(){
    this.httpService.getRadnici()
    .subscribe({
      next: (data) => {
        this.radnici = data.payload;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dovlačenja radnika', error.error.message);
      }
    })
  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  obrisiRN(radniNalog:any){
    this.httpService.deleteRadniNalog(radniNalog.id)
    .subscribe({
      next: (data) => {
        this.openDialog('Radni nalog uspešno obrisan');
        this.radniNalozi = this.radniNalozi.filter(rn => rn.id != radniNalog.id);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom brisanja radnog naloga', error.error.message);
      }
    })
  }

  kreirajRN(){
    this.kreiranjeNovogRN = true;
    this.noviRadniNalog = {
      vozilo: null,
      datum_odobrenja: null,
      datum_prijem: null,
      odobreno_putem: '',
      km_prijem: 0,
      km_isporuka: 0,
      napomena: '',
      osnovni_pregled: false,
      spakovati_stare_delove: false,
      radni_nalog_id: '',
      radnik_primio: null,
      radnik_zaduzen: null,
    }
  }

  onKey(event:Event) {
    const value = (event.target as HTMLInputElement).value
    this.selectedVozila = this.search(value);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.vozila.filter(option => option.broj_sasije.toLowerCase().startsWith(filter));
  }

  sacuvajRN(){
    console.log(this.noviRadniNalog);
    this.httpService.saveRadniNalog(this.noviRadniNalog)
    .subscribe({
      next: (data) => {
        this.openDialog('Radni nalog uspešno sačuvan');
        this.ponistiRN();
        this.getRadniNalozi();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dodavanja radnog naloga', error.error.message);
      }
    })
  }

  ponistiRN(){
    this.kreirajRN();
    this.kreiranjeNovogRN = false;
  }
}
