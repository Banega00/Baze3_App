import { Component, Input } from '@angular/core';
import { StavkaRacunaModel } from '@shared-items/models/stavka-racuna.model';

@Component({
  selector: 'app-stavka-racuna',
  templateUrl: './stavka-racuna.component.html',
  styleUrls: ['./stavka-racuna.component.css']
})
export class StavkaRacunaComponent {

  @Input()
  stavka: StavkaRacunaModel;


}
