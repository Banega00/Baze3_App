import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProizvodModel } from '@shared-items/models/proizvod.model';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';
import * as moment from 'moment';
import { CenaProizvodaModel } from '@shared-items/models/cena-proizvoda.model';
import { ValutaModel } from '@shared-items/models/valuta.model';
@Component({
  selector: 'app-proizvodi-page',
  templateUrl: './proizvodi-page.component.html',
  styleUrls: ['./proizvodi-page.component.css']
})
export class ProizvodiPageComponent {
  moment: any = moment;
  proizvodi: (ProizvodModel & { nova_cena: CenaProizvodaModel, addingNewCena: boolean })[];
  valute: ValutaModel[];
  panelOpenState: boolean = false;
  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.getProizvodi();
    this.getValute();
  }

  getProizvodi() {
    this.httpService.getProizvodi()
      .subscribe({
        next: (data) => {
          (this.proizvodi as any) = data.payload!.map(proizvod => {
            return { ...proizvod, addingNewCena: false }
          });
          for (const proizvod of this.proizvodi) {
            (proizvod.nova_cena as Partial<typeof proizvod.nova_cena>) = {
              datum_do: new Date(),
              datum_od: new Date(),
              iznos: 0,
              id: 0,
              proizvod_id: proizvod.sifra,
            }
          }
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom brisanja cene', error.error.message);
        }
      })
  }

  addNewCena(proizvod: typeof this.proizvodi[0]) {
    proizvod.addingNewCena = true;
  }

  getValute() {
    this.httpService.getValute()
      .subscribe({
        next: (data) => {
          this.valute = data.payload!;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          this.openDialog('Greška prilikom dovlačenja valuta', error.error.message);
        }
      })
  }

  ponistiDodavanjeCene(proizvod: typeof this.proizvodi[0]) {
    proizvod.addingNewCena = false;
    (proizvod.nova_cena as any) = {
      datum_do: new Date(),
      datum_od: new Date(),
      iznos: 0,
      id: 0,
      proizvod_id: proizvod.sifra,
      valuta_id: 0
    }
  }

  sacuvajCenu(proizvod: typeof this.proizvodi[0]){
    this.httpService.saveNewCena(proizvod.nova_cena).subscribe({
      next: (data) => {
        this.openDialog('Cena uspešno dodata')
        this.getProizvodi();
        this.getValute();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom čuvanja cene', error.error.message);
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

  obrisiCenuProizvoda(proizvod: ProizvodModel, cena_proizvoda: CenaProizvodaModel) {
    this.httpService.obrisiCenuProizvoda(proizvod.sifra, cena_proizvoda.id).subscribe({
      next: (data) => {
        this.openDialog('Cena uspešno obrisana')
        this.getProizvodi();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom brisanja cene', error.error.message);
      }
    })
  }
}
