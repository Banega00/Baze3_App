import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { VoziloModel } from '@shared-items/models/vozilo.model'
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';


const COLUMNS_SCHEMA = [
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
      key: "naziv",
      type: "text",
      label: "Model"
  },
  {
      key: "naziv_marke",
      type: "text",
      label: "Naziv marke"
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
]
@Component({
  selector: 'app-vozila-tab',
  templateUrl: './vozila-tab.component.html',
  styleUrls: ['./vozila-tab.component.css']
})
export class VozilaTabComponent{
  public displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);

  @Input()
  public vozila: VoziloModel[];
  public columnsSchema: any = COLUMNS_SCHEMA;

  @Input()
  markeVozila: MarkaVozilaModel[] = []

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    
  }


  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  sacuvaj(element:{isEdit: boolean}){
    element.isEdit = !element.isEdit; 
    
  }

  ponisti(element:{isEdit: boolean}){
    element.isEdit = !element.isEdit;     
  }
}
