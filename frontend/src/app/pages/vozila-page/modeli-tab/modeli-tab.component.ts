import { Component } from '@angular/core';
import { MarkaVozilaModel } from './models/marka-vozila.model';

@Component({
  selector: 'app-modeli-tab',
  templateUrl: './modeli-tab.component.html',
  styleUrls: ['./modeli-tab.component.css']
})
export class ModeliTabComponent {

  panelOpenState = false;

  markeVozila: MarkaVozilaModel[] = [
    { id: 1, naziv: 'Volkswagen', modeli: [{ id: 1, naziv: 'Polo', oznaka: 'POL' }] },
  ]
  constructor() {
    
  }
}
