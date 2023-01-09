import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { MatDialog } from '@angular/material/dialog';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
@Component({
  selector: 'app-klijenti-page',
  templateUrl: './klijenti-page.component.html',
  styleUrls: ['./klijenti-page.component.css']
})
export class KlijentiPageComponent implements OnInit{

  public klijenti: KlijentModel[];
  public vlasnistva: { [key: string]: (VlasnistvoModel & {isEdit: boolean})[]};

  public noviKlijent: KlijentModel;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.klijenti = [];
  }

  ngOnInit(): void {
    this.getVlasnistvaIKlijente();
  }

  getVlasnistvaIKlijente(){
    this.httpService.getKlijent()
    .subscribe(data => {
      this.klijenti = data.payload?.map(klijent => {
        klijent.original_jmbg = klijent.jmbg;
        return klijent;
      })!;
    })

    this.httpService.getVlasnistva()
    .subscribe(data  => {
      const vlasnistvaData: any = data.payload;
      for(const broj_sasije in vlasnistvaData){
        vlasnistvaData[broj_sasije] = vlasnistvaData[broj_sasije].map((el:VlasnistvoModel & {isEdit:boolean}) => {
          el.isEdit = false;
          el.original_klijent_id = el.klijent_id;
          el.original_ime_vlasnika = el.ime_vlasnika;
          return el;
        })
      }
      this.vlasnistva = vlasnistvaData;
      console.log(this.vlasnistva)
      console.log(this)
    })
  }
}
