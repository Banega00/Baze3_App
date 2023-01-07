import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-klijent',
  templateUrl: './klijent.component.html',
  styleUrls: ['./klijent.component.css']
})
export class KlijentComponent implements OnInit{
  @Input()
  klijent: KlijentModel;

  @Input()
  editMode: boolean = false;

  @Input()
  refreshState: any;

  @Output() 
  deleteKlijentEmiiter = new EventEmitter<string>();

  klijentCopy: KlijentModel;

  constructor(private httpService:HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.klijentCopy = {...this.klijent};
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
    this.httpService.updateKlijent(this.klijent)
    .subscribe({
      next: (data) => {
        this.openDialog('Uspešno ažurirani podaci o klijentu');
        this.klijentCopy = {...this.klijent};
        this.refreshState()
      },
      error: (error) => {
        console.log(error);
        this.klijent = {...this.klijentCopy};
        this.editMode = false;
        this.openDialog('Greška prilikom ažuriranja podataka o klijentu', error.error.message);
      }
   });
  }

  cancelEditChanges(){
    this.klijent = {...this.klijentCopy};
    this.editMode = false;
  }

  deleteKlijent(){
    this.deleteKlijentEmiiter.emit(this.klijent.jmbg)
  }

  
}
