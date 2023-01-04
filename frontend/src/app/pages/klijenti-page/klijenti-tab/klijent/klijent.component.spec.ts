import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlijentComponent } from './klijent.component';

describe('KlijentComponent', () => {
  let component: KlijentComponent;
  let fixture: ComponentFixture<KlijentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlijentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlijentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
