import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacuniComponent } from './racuni.component';

describe('RacuniComponent', () => {
  let component: RacuniComponent;
  let fixture: ComponentFixture<RacuniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RacuniComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RacuniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
