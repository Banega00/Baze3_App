import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VozilaPageComponent } from './vozila-page.component';

describe('VozilaPageComponent', () => {
  let component: VozilaPageComponent;
  let fixture: ComponentFixture<VozilaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VozilaPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VozilaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
