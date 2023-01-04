import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlijentiTabComponent } from './klijenti-tab.component';

describe('KlijentiTabComponent', () => {
  let component: KlijentiTabComponent;
  let fixture: ComponentFixture<KlijentiTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KlijentiTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KlijentiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
