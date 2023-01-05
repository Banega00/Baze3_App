import { Component, OnInit } from '@angular/core';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
import { HttpService } from 'src/app/http.service';

@Component({
  selector: 'app-vozila-page',
  templateUrl: './vozila-page.component.html',
  styleUrls: ['./vozila-page.component.css']
})
export class VozilaPageComponent implements OnInit{
  markeVozila: MarkaVozilaModel[] = [];
  vozila: VoziloModel[];
  constructor(private httpService: HttpService) {
    
  }

  ngOnInit(): void {
    this.httpService.getVozila()
    .subscribe(data => {
      this.vozila = data.payload!;
      console.log(this.vozila);
    })

    this.httpService.getMarkeIModeliVozila()
    .subscribe(data => {
      this.markeVozila = data.payload!;
    })
  }
}
