import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { VoziloModel } from '@shared-items/models/vozilo.model'
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-vozila-tab',
  templateUrl: './vozila-tab.component.html',
  styleUrls: ['./vozila-tab.component.css']
})
export class VozilaTabComponent implements OnInit{
  
  @Input()
  get vozila(){
    return this._vozila;
  }

  public _vozila: VoziloModel[];

  vozilaCopy: typeof this._vozila;

  set vozila(vozila:VoziloModel[]){
    this._vozila = vozila.map(vozilo => {
      vozilo.model_i_marka =  `${vozilo.model?.naziv} ${vozilo.marka?.naziv}`;
      vozilo.original_broj_sasije = vozilo.broj_sasije;
      return vozilo;
    })
  }

  @Input()
  get markeVozila(){
    return this._markeVozila;
  }
  
  makre_i_modeli: string[];
  public _markeVozila: MarkaVozilaModel[];

  set markeVozila(markeVozila:MarkaVozilaModel[]){
    this._markeVozila = markeVozila;
    this.makre_i_modeli = [];
    for(const marka of markeVozila){
      for(const model of marka.modeli)
      this.makre_i_modeli.push(`${model?.naziv} ${marka?.naziv}`)
    }
  }

  public columnsSchema: any[]

  public displayedColumns: string[];

  panelOpenState = false;

  ngOnInit(): void {
    if(this.markeVozila && this._vozila){
      this.columnsSchema = [
        {
            key: "broj_sasije",
            type: "text",
            label: "Broj šasije"
        },
        {
            key: "godiste",
            type: "number",
            label: "Godište"
        },
        {
            key: "model_i_marka",
            type: "text",
            label: "Model i marka"
        },
        {
            key: "broj",
            type: "text",
            label: "Registarski broj"
        },
        {
            key: "grad",
            type: "text",
            label: "Grad"
        },
        {
            key: "oznaka_grada",
            type: "text",
            label: "Oznaka grada"
        },
        {
          key: "isEdit",
          type: "isEdit",
          label: ""
        }
      ];
  
      this.displayedColumns= this.columnsSchema.map((col) => col.key);
    }
  }

  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  pretrazi(){
    const broj_sasije = (document.querySelector('#input-broj-sasije') as any).value.toUpperCase();
    const godiste_od = +(document.querySelector('#input-godiste-od') as any).value;
    const godiste_do = +(document.querySelector('#input-godiste-do') as any).value || 3000;
    this.httpService.getVozila({broj_sasije, godiste_od, godiste_do})
    .subscribe({
      next: (data) => {
        this.vozila = data.payload!;
      },
      error: (error) => {
        this.openDialog('Greška prilikom pretrage vozila', error.error.message);
      }}
    )
  }
  
  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  sacuvaj(element:any){
    this.httpService.saveVehicle(element)
    .subscribe({
      next: (data) => {
        this.openDialog('Uspešno sačuvano vozilo');
        element.isEdit = !element.isEdit; 
      },
      error: (error) => {
        this.openDialog('Greška prilikom čuvanja vozila', error.error.message);
      }
   });
  }

  ponisti(element:any){
    this._vozila = this.vozilaCopy.map(vozilo =>{
      if(vozilo.broj_sasije == element.broj_sasije){
        (vozilo as any).isEdit = false;
      }

      return vozilo;
    }); 
    element.isEdit = !element.isEdit;    
  }

  izmeni(element:any){
    element.isEdit = !element.isEdit;
    this.vozilaCopy = JSON.parse(JSON.stringify(this.vozila));

  }

  obrisi(element:any){
    this._vozila = this._vozila.filter(vozilo => vozilo.broj_sasije != element.broj_sasije);
    console.log(this._vozila);
    this.httpService.deleteVehicle(element)
    .subscribe({
      next: (data) => {
        this.openDialog('Vozilo uspešno obrisano');
        element.isEdit = !element.isEdit; 
      },
      error: (error) => {
        this.openDialog('Greška prilikom brisanja vozila', error.error.message);
      }
   });
  }

  dodajVozilo() {
    const vozilo = {
      "broj_sasije": "",
      "broj_osiguranja": "",
      "grad": "",
      "oznaka_grada": "",
      "broj": "",
      "godiste": 0,
      "model_id": "",
      "marka_id": "",
      "id": "",
      "naziv_marke": "",
      "naziv": "",
      "oznaka": "",
      "marka": {
        "id": "",
        "naziv": ""
      },
      "model": {
        "id": "",
        "naziv": ""
      },
      "model_i_marka": "",
      "isEdit": true
    }
    this.vozilaCopy = this._vozila;
    this._vozila = [(vozilo as any), ...this._vozila];
  }

  model_i_marka_changed(element:any){
    const [model_naziv, marka_naziv] = element.model_i_marka.split(' ');
    const {marka, model} = this.nadjiMarkuIModel(model_naziv,marka_naziv)!;

    element.marka_id = marka.id;
    element.model_id = model.id;
    element.marka.id = marka.id;
    element.marka.naziv = marka.naziv;
    
    element.model.id = model.id;
    element.model.naziv = model.naziv;

    console.log(element)
  }

  nadjiMarkuIModel(model_naziv:string, marka_naziv:string){
    for(const marka of this.markeVozila){
      for(const model of marka.modeli){
        if(model.naziv == model_naziv && marka_naziv == marka.naziv) return {marka, model};
      }
    }
    return null;
  }
}
