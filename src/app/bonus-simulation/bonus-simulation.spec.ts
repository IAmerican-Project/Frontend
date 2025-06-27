import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusSimulation } from './bonus-simulation';

describe('BonusSimulation', () => {
  let component: BonusSimulation;
  let fixture: ComponentFixture<BonusSimulation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusSimulation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusSimulation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
