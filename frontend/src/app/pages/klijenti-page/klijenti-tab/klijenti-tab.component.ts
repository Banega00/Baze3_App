import { Component, Input } from '@angular/core';
import { KlijentModel } from '@shared-items/models/klijent.model';
import { HttpService } from 'src/app/http.service';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';

@Component({
  selector: 'app-klijenti-tab',
  templateUrl: './klijenti-tab.component.html',
  styleUrls: ['./klijenti-tab.component.css']
})
export class KlijentiTabComponent {

  @Input()
  public klijenti: KlijentModel[];
  public loading: boolean;

  public addingNew: boolean;

  public noviKlijent: KlijentModel;

  @Input()
  refreshState: any;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.klijenti = [];
    this.loading = true;
    this.addingNew = false;
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
    this.noviKlijent = {ime:'', jmbg:'', br_lk:''} 
  }
  
  saveNewKlijent(){
    this.httpService.addNewClient(this.noviKlijent)
    .subscribe({
      next: (data) => {
        this.openDialog('Uspešno dodat novi klijent');
        this.klijenti.unshift(this.noviKlijent)
        this.addingNew = false;
        this.noviKlijent = {ime:'', jmbg:'', br_lk:''};
        this.refreshState();
      },
      error: (error) => {
        this.openDialog('Greška prilikom dodavanja novog klijenta', error.error.message);
      }
   });
    
  }

  cancelNewKlijent(){
    this.addingNew = false;
    this.noviKlijent = {ime:'', jmbg:'', br_lk:''};
  }

  deleteKlijent(jmbg: string){
    this.httpService.deleteKlijent(jmbg)
    .subscribe({
      next: (data) => {
        this.openDialog(`Uspešno obrisan klijent sa JMBG: ${jmbg}`);
        this.klijenti = this.klijenti.filter(klijent => klijent.jmbg != jmbg);
        this.refreshState();
      },
      error: (error) => {
        this.openDialog('Greška prilikom brisanja klijenta', error.error.message);
      }
   });
  }
}
