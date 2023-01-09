import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadniciPageComponent } from './radnici-page.component';

describe('RadniciPageComponent', () => {
  let component: RadniciPageComponent;
  let fixture: ComponentFixture<RadniciPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadniciPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadniciPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
