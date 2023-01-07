import { Component, Input, OnInit, Output, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
import * as moment from 'moment';
import { map, Observable, startWith } from 'rxjs';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-vlasnistva-tab',
  templateUrl: './vlasnistva-tab.component.html',
  styleUrls: ['./vlasnistva-tab.component.css']
})
export class VlasnistvaTabComponent implements OnInit {
  
  panelOpenState = false;
  moment: any = moment;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    
  }

  @Input()
  @Output()
  public vlasnistva: { [key: string]: (VlasnistvoModel & { isEdit: boolean, isNew?: boolean })[] };

  public vlasnistvaCopy: { [key: string]: (VlasnistvoModel & { isEdit: boolean, isNew?: boolean })[] };

  @Input()
  @Output()
  public klijenti: KlijentModel[];

  @Input()
  refreshState: any;

  izmeniVlasnistvo(vlasnistvo: typeof this.vlasnistva['any'][0]) {
    vlasnistvo.isEdit = true;
    this.vlasnistvaCopy = this.cloneVlanistvo(this.vlasnistva);
  }

  private cloneVlanistvo(vlasnistvno: any){
    return JSON.parse(JSON.stringify(vlasnistvno))
  }

  sacuvajIzmene(vlasnistvo: typeof this.vlasnistva['any'][0]) {
    this.httpService.saveVlasnistvo(vlasnistvo)
    .subscribe({
      next: (data) => {
        this.openDialog(`Uspešno sačuvano vlasnistvo`);
        vlasnistvo.isNew = false;
        this.refreshState();
      },
      error: (error) => {
        this.openDialog('Greška prilikom čuvanja vlasništva', error.error.message);
        this.refreshState();
        this.vlasnistva = this.cloneVlanistvo(this.vlasnistvaCopy);
      }
    })

    vlasnistvo.isEdit = false;
  }

  ponistiIzmena(vlasnistvo: typeof this.vlasnistva['any'][0], index: number) {
    this.vlasnistva = this.cloneVlanistvo(this.vlasnistvaCopy);
    
    this.vlasnistva[vlasnistvo.broj_sasije][index].isEdit = false;

  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  obrisiVlasnistvo(vlasnistvo: typeof this.vlasnistva['any'][0]) {
    this.httpService.deleteVlasnistvo(vlasnistvo)
      .subscribe({
        next: (data) => {
          this.openDialog(`Uspešno obrisano vlasnistvo`);
          // for(const broj_sasije in this.vlasnistva){
          //   if(broj_sasije==vlasnistvo.broj_sasije){
          //     this.vlasnistva[broj_sasije] = this.vlasnistva[broj_sasije].filter(vlas => {
          //       return !(vlas.broj_sasije == vlasnistvo.broj_sasije &&
          //       vlas.rb == vlasnistvo.rb &&
          //       vlas.klijent_id == vlasnistvo.klijent_id &&
          //       vlas.servisna_knjiga_id == vlasnistvo.servisna_knjiga_id )
          //     })
          //   }
          // }
          this.refreshState();
        },
        error: (error) => {
          this.openDialog('Greška prilikom brisanja vlasništva', error.error.message);
        }
      })
  }

  dodajVlasnistvo(broj_sasije: string, event: Event){
    console.log(broj_sasije);
    event.stopImmediatePropagation();
    this.vlasnistva[broj_sasije].unshift({
      broj_sasije,
      datum_od: '',
      datum_do: '',
      rb: 0,
      ime_vlasnika: '',
      servisna_knjiga_id: this.vlasnistva[broj_sasije][0].servisna_knjiga_id,
      klijent_id: '',
      original_klijent_id: '',
      isEdit: true,
      isNew: true
    })
  }

  datum_do_change(event: any, vlasnistvo: typeof this.vlasnistva['any'][0]) {
    vlasnistvo.datum_do = new Date(event.target.value).toISOString();
    console.log(vlasnistvo)
  }

  datum_od_change(event: any, vlasnistvo: typeof this.vlasnistva['any'][0]) {
    vlasnistvo.datum_od = new Date(event.target.value).toISOString();    
    console.log(vlasnistvo)
  }

  ngOnInit(): void {
  }
}
