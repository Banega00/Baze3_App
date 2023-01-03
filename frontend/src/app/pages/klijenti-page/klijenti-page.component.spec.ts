import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlijentiPageComponent } from './klijenti-page.component';

describe('KlijentiPageComponent', () => {
  let component: KlijentiPageComponent;
  let fixture: ComponentFixture<KlijentiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlijentiPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlijentiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
