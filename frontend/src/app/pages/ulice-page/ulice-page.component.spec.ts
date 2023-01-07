import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UlicePageComponent } from './ulice-page.component';

describe('UlicePageComponent', () => {
  let component: UlicePageComponent;
  let fixture: ComponentFixture<UlicePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UlicePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UlicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
