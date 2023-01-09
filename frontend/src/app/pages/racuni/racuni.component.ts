import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProizvodModel } from '@shared-items/models/proizvod.model';
import { RacunModel } from '@shared-items/models/racun.model';
import * as moment from 'moment';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-racuni',
  templateUrl: './racuni.component.html',
  styleUrls: ['./racuni.component.css']
})
export class RacuniComponent implements OnInit {
  public racuni: (RacunModel & { addingNew?: boolean | undefined, newStavka: RacunModel['stavke_racuna'][0] })[];
  moment: any = moment;
  panelOpenState: boolean = false;

  proizvodi: ProizvodModel[];

  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getRacuni();
    this.getProizvodi();
  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  obrisiStavku(stavka: RacunModel['stavke_racuna'][0]) {
    this.httpService.deleteStavkaRacuna(stavka)
      .subscribe({
        next: (data) => {
          this.racuni = this.racuni.map(racun => {
            if (racun.id == stavka.racun_id) {
              racun.stavke_racuna = racun.stavke_racuna.filter(sr => sr.rb != stavka.rb)
            }
            return racun;
          })
          console.log(data);
          this.getRacuni();
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom prikazivanja brisanja stavke računa', error.error.message);
        }
      })
  }

  dodajNovuStavku(racun: typeof this.racuni[0]) {
    racun.newStavka = {
      rb: 0,
      kolicina: 0,
      procenat_rabat: 0,
      proizvod: null,
      proizvod_id: null,
      racun_id: racun.id
    }
    racun.addingNew = true;
  }

  getRacuni() {
    this.httpService.getRacuni()
      .subscribe({
        next: (data) => {
          (this.racuni as any) = data.payload!;

          this.racuni = this.racuni.map(racun => {
            racun.newStavka = {
              rb: 0,
              kolicina: 0,
              procenat_rabat: 0,
              proizvod: null,
              proizvod_id: null,
              racun_id: racun.id
            }
            return racun;
          })
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom prikazivanja radnih naloga', error.error.message);
        }
      })
  }

  getProizvodi() {
    this.httpService.getProizvodi()
      .subscribe({
        next: (data) => {
          this.proizvodi = data.payload!;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom prikazivanja računa', error.error.message);
        }
      })
  }

  obrisiRacun(racun: RacunModel) {
    this.httpService.obrisiRacun(racun.id)
      .subscribe({
        next: (data) => {
          this.openDialog('Račun uspešno obrisan');
          this.getRacuni();
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom brisanja računa', error.error.message);
        }
      })
  }

  ponistiNovuStavku(racun: typeof this.racuni[0]) {
    racun.addingNew = false;
    racun.newStavka = {
      rb: 0,
      kolicina: 0,
      procenat_rabat: 0,
      proizvod: null,
      proizvod_id: null,
      racun_id: racun.id
    };
  }

  sacuvajNovuStavku(racun: typeof this.racuni[0]) {

    this.httpService.saveNewStavka(racun.newStavka)
      .subscribe({
        next: (data) => {
          this.openDialog('Uspešno dodata nova stavka');
          console.log(data);
          this.getRacuni();
          racun.addingNew = false;
          racun.newStavka = {
            rb: 0,
            kolicina: 0,
            procenat_rabat: 0,
            proizvod: null,
            proizvod_id: null,
            racun_id: racun.id
          };
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom dodavanja stavke', error.error.message);
        }
      })
  }

}
