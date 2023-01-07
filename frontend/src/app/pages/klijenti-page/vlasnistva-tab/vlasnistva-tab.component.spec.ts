import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlasnistvaTabComponent } from './vlasnistva-tab.component';

describe('VlasnistvaTabComponent', () => {
  let component: VlasnistvaTabComponent;
  let fixture: ComponentFixture<VlasnistvaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VlasnistvaTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlasnistvaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
