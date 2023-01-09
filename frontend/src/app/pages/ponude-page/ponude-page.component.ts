import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';
@Component({
  selector: 'app-ponude-page',
  templateUrl: './ponude-page.component.html',
  styleUrls: ['./ponude-page.component.css']
})
export class PonudePageComponent {
  moment: any = moment;
  ponude:any[];
  radnici: any[];

  kreiranjeNovePonude: boolean = false;
  novaPonuda:any = {};
  radniNalozi: any[];

  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getPonude();
    this.getRadnici();
    this.getRadniNalozi();
  }

  getPonude() {
    this.httpService.getPonude()
    .subscribe({
      next: (data) => {
        this.ponude = data.payload;
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

  obrisiPonudu(ponuda:any){
    this.httpService.deletePonuda(ponuda.id)
    .subscribe({
      next: (data) => {
        this.openDialog('Ponuda uspešno obrisana');
        this.ponude = this.ponude.filter(p => p.id != ponuda.id);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom brisanja radnog naloga', error.error.message);
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

  kreirajPonudu(){
    this.kreiranjeNovePonude = true;
    this.novaPonuda = {
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
      isNew: true
    }
  }

  sacuvajPonudu(){
    console.log(this.novaPonuda);
    this.httpService.savePonuda(this.novaPonuda)
    .subscribe({
      next: (data) => {
        this.openDialog('Ponuda uspešno sačuvan');
        this.ponistiPonudu();
        this.getPonude();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dodavanja nova ponude', error.error.message);
      }
    })
  }

  ponistiPonudu(){
    this.kreirajPonudu();
    this.kreiranjeNovePonude = false;
  }
}
