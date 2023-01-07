import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzvestajiPageComponent } from './izvestaji-page.component';

describe('IzvestajiPageComponent', () => {
  let component: IzvestajiPageComponent;
  let fixture: ComponentFixture<IzvestajiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzvestajiPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IzvestajiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
