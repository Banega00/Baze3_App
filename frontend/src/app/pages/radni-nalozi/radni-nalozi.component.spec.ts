import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadniNaloziComponent } from './radni-nalozi.component';

describe('RadniNaloziComponent', () => {
  let component: RadniNaloziComponent;
  let fixture: ComponentFixture<RadniNaloziComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadniNaloziComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadniNaloziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
