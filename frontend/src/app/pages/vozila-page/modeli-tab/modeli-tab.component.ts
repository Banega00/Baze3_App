import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { MarkaVozilaModel } from '../../../../../../shared-items/models/marka-vozila.model';

@Component({
  selector: 'app-modeli-tab',
  templateUrl: './modeli-tab.component.html',
  styleUrls: ['./modeli-tab.component.css']
})
export class ModeliTabComponent implements OnInit {

  panelOpenState = false;

  markeVozila: MarkaVozilaModel[] = []
  
  loading = true;

  constructor(private httpService: HttpService) {
    
  }

  ngOnInit(): void {
    this.httpService.getMarkeIModeliVozila()
    .subscribe(data => {
      this.markeVozila = data.payload!;
      this.loading = false;
    })
  }
}
