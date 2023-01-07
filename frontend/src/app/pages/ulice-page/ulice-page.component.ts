import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-ulice-page',
  templateUrl: './ulice-page.component.html',
  styleUrls: ['./ulice-page.component.css']
})
export class UlicePageComponent implements OnInit {

  ulice: any;
  gradovi: any[];
  drzave: any[];
  panelOpenState = true;
  addingNew: boolean = false;

  izabranaDrzava: typeof this.drzave[0];
  filtriraniGradovi: typeof this.gradovi;
  
  novaUlica:any = {};

  constructor(private httpService: HttpService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.prikaziUlice();
  }

  prikaziUlice(){
    this.httpService.getUlice()
    .subscribe({
      next: (data) => {
        this.ulice = data.payload.ulice;
        this.gradovi = data.payload.gradovi;
        this.drzave = data.payload.drzave;
      },
      error: (error) => {
        this.openDialog('Greška prilikom prikazivanja ulica', error.error.message);
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

  izabraoDrzavu(event: MatSelectChange){
    const drzava = event.value
    this.filtriraniGradovi = this.gradovi.filter(grad => grad.drzava_id == drzava.id);
    this.izabranaDrzava = drzava;

    this.novaUlica.drzava = drzava;
  }

  izabraoGrad(event: MatSelectChange){
    this.novaUlica.grad = event.value;
  }

  ponistiDodavanjeUlice(){
    this.novaUlica = {};
    this.addingNew = false;
  }

  sacuvajUlicu(){
    const nazivUlice = (document.querySelector('#nazivUliceInput') as any).value;
    this.novaUlica.naziv = nazivUlice;
    this.httpService.saveUlica(this.novaUlica)
    .subscribe({
      next: (data) => {

        this.openDialog('Ulica uspešno dodata');
        this.addingNew = false;
        this.novaUlica = {}
        this.prikaziUlice();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom dodavanja ulice', error.error.message);
      }
    })
  }

  deleteUlica(ulica: any) {
    this.httpService.deleteUlica(ulica)
      .subscribe({
        next: (data) => {

          this.openDialog('Ulica uspešno obrisana');

          this.prikaziUlice();
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom brisanja ulice', error.error.message);
        }
      })
  }
}
