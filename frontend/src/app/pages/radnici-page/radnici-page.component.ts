import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';
import { RadnikModel } from '@shared-items/models/radnik.model'

@Component({
  selector: 'app-radnici-page',
  templateUrl: './radnici-page.component.html',
  styleUrls: ['./radnici-page.component.css']
})
export class RadniciPageComponent implements OnInit{

  public radnici: RadnikModel[];
  public loading: boolean;

  public addingNew: boolean;

  public noviRadnik: RadnikModel;

  public pozicije: RadnikModel['pozicija'][];

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.loading = true;
    this.addingNew = false;

    
  }

  ngOnInit(): void {
    this.getPozicije();
    this.getRadnici();

  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  addNewKlijent(){
    if(this.addingNew) return;
    this.addingNew = true;
    this.noviRadnik = {ime_prezime:'', jmbg:'', br_lk:'', pozicija:{id: 0, naziv:''}} 
  }
  
  saveNoviRadnik(){
    this.httpService.addNoviRadnik(this.noviRadnik)
    .subscribe({
      next: (data) => {
        this.openDialog('Uspešno dodat novi radnik');
        this.noviRadnik.pozicija_id = this.noviRadnik.pozicija?.id;
        this.radnici.unshift(this.noviRadnik)
        this.addingNew = false;
        this.noviRadnik = {ime_prezime:'', jmbg:'', br_lk:'', pozicija:{id: 0, naziv:''}} 
      },
      error: (error) => {
        this.openDialog('Greška prilikom dodavanja novog radnika', error.error.message);
      }
   });
    
  }

  cancelNoviRadnik(){
    this.addingNew = false;
    this.noviRadnik = {ime_prezime:'', jmbg:'', br_lk:'', pozicija:{id: 0, naziv:''}} 
  }

  deleteRadnik(jmbg: string){
    this.httpService.deleteRadnik(jmbg)
    .subscribe({
      next: (data) => {
        this.openDialog(`Uspešno obrisan radnik sa JMBG: ${jmbg}`);
        this.radnici = this.radnici.filter(radnik => radnik.jmbg != jmbg);
      },
      error: (error) => {
        this.openDialog('Greška prilikom brisanja radnika', error.error.message);
      }
   });
  }

  getPozicije(){
    this.httpService.getPozicije()
    .subscribe({
      next: (data) => {
        this.pozicije = data.payload;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dovlačenja pozicija', error.error.message);
      }
    })
  }

  getRadnici(){
    this.httpService.getRadnici()
    .subscribe({
      next: (data) => {
        this.radnici = data.payload.map((radnik:any) =>{
          radnik.original_jmbg = radnik.jmbg;
          return radnik
        });
        this.getPozicije();
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dovlačenja radnika', error.error.message);
      }
    })
  }
}
