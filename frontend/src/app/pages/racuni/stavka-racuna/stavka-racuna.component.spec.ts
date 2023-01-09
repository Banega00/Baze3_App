import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StavkaRacunaComponent } from './stavka-racuna.component';

describe('StavkaRacunaComponent', () => {
  let component: StavkaRacunaComponent;
  let fixture: ComponentFixture<StavkaRacunaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StavkaRacunaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StavkaRacunaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
