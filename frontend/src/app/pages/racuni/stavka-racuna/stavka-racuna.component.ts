import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StavkaRacunaModel } from '@shared-items/models/stavka-racuna.model';

@Component({
  selector: 'app-stavka-racuna',
  templateUrl: './stavka-racuna.component.html',
  styleUrls: ['./stavka-racuna.component.css']
})
export class StavkaRacunaComponent {

  @Input()
  stavka: StavkaRacunaModel;

  @Input()
  index: number;

  @Output()
  obrisiStavkuEE:EventEmitter<StavkaRacunaModel> = new EventEmitter();

  obrisiStavku(){
    return this.obrisiStavkuEE.next(this.stavka);
  }
}
