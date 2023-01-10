import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProizvodiPageComponent } from './proizvodi-page.component';

describe('ProizvodiPageComponent', () => {
  let component: ProizvodiPageComponent;
  let fixture: ComponentFixture<ProizvodiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProizvodiPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProizvodiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
