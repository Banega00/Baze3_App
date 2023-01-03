import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServisneKnjigeTabComponent } from './servisne-knjige-tab.component';

describe('ServisneKnjigeTabComponent', () => {
  let component: ServisneKnjigeTabComponent;
  let fixture: ComponentFixture<ServisneKnjigeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServisneKnjigeTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServisneKnjigeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
