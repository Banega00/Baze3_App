import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PonudePageComponent } from './ponude-page.component';

describe('PonudePageComponent', () => {
  let component: PonudePageComponent;
  let fixture: ComponentFixture<PonudePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PonudePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PonudePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
