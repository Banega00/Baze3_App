import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { RadnikModel } from '@shared-items/models/radnik.model';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-radnik',
  templateUrl: './radnik.component.html',
  styleUrls: ['./radnik.component.css']
})
export class RadnikComponent {
  @Input()
  radnik: RadnikModel;

  pozicijaIndex: number;

  @Input()
  editMode: boolean = false;

  @Output() 
  deleteRadnikEmitter = new EventEmitter<string>();

  radnikCopy: RadnikModel;

  @Input()
  public pozicije: RadnikModel['pozicija'][];

  constructor(private httpService:HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.pozicijaIndex = this.pozicije?.findIndex(pozicija => (pozicija as any).id == this.radnik.pozicija_id)
    this.radnik.pozicija = this.pozicije[this.pozicijaIndex]
    this.radnikCopy = {...this.radnik};
  }

  pozicijaChanged(event:MatSelectChange){
    console.log("SETUJEM NA RADNIKA", event.value)
    this.radnik.pozicija = event.value;
  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  saveEditChanges(){
    this.editMode = false;
    this.httpService.updateRadnik(this.radnik)
    .subscribe({
      next: (data) => {
        this.openDialog('Uspešno ažurirani podaci o radniku');
        this.radnikCopy = {...this.radnik};
      },
      error: (error) => {
        console.log(error);
        this.radnik = {...this.radnikCopy};
        this.editMode = false;
        this.openDialog('Greška prilikom ažuriranja podataka o radniku', error.error.message);
      }
   });
  }

  cancelEditChanges(){
    this.radnik = {...this.radnikCopy};
    this.editMode = false;
  }

  deleteRadnik(){
    this.deleteRadnikEmitter.emit(this.radnik.jmbg)
  }
}
