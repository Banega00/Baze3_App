import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VozilaTabComponent } from './vozila-tab.component';

describe('VozilaTabComponent', () => {
  let component: VozilaTabComponent;
  let fixture: ComponentFixture<VozilaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VozilaTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VozilaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
