import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tablaamericano } from './tablaamericano';

describe('Tablaamericano', () => {
  let component: Tablaamericano;
  let fixture: ComponentFixture<Tablaamericano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tablaamericano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tablaamericano);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
