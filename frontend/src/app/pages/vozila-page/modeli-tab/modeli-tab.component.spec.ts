import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeliTabComponent } from './modeli-tab.component';

describe('ModeliTabComponent', () => {
  let component: ModeliTabComponent;
  let fixture: ComponentFixture<ModeliTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeliTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeliTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
