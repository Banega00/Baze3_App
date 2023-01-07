import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';
import * as moment from 'moment';
@Component({
  selector: 'app-izvestaji-page',
  templateUrl: './izvestaji-page.component.html',
  styleUrls: ['./izvestaji-page.component.css']
})
export class IzvestajiPageComponent {
  moment: any = moment;
  izvestaji:any[];

  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getIzvestaji();
  }

  getIzvestaji() {
    this.httpService.getIzvestaji()
    .subscribe({
      next: (data) => {
        this.izvestaji = data.payload;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom prikazivanja izveštaja', error.error.message);
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

  promeni(izvestajId: number){
    const value = +(document.querySelector('#input') as any).value;
    this.httpService.changeAntifrizTackaMrz(izvestajId, value)
    .subscribe({
      next: (data) => {
        this.openDialog('Tačka mržnjenja antifriza uspešno ažurirana');
        this.getIzvestaji();
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom ažuriranja tačke mržnjenja', error.error.message);
      }
    })
    console.log(value)
  }
}
