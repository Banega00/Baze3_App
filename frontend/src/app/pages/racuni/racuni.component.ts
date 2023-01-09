import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RacunModel } from '@shared-items/models/racun.model';
import * as moment from 'moment';
import { SimpleDialogComponent } from 'src/app/dialog-component/simple-dialog.component';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-racuni',
  templateUrl: './racuni.component.html',
  styleUrls: ['./racuni.component.css']
})
export class RacuniComponent implements OnInit{
  public racuni: RacunModel[];
  moment: any = moment;
  panelOpenState:boolean = false;
  constructor(private httpService: HttpService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getRacuni();
  }

  openDialog(title: string, message: string = '') {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {
        title,
        message
      }
    });
  }

  getRacuni() {
    this.httpService.getRacuni()
    .subscribe({
      next: (data) => {
        this.racuni = data.payload!;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
        this.openDialog('Greška prilikom prikazivanja radnih naloga', error.error.message);
      }
    })
  }

  obrisiRacun(racun:RacunModel){

  }
}
