import { Injectable } from '@angular/core';
import { BondData } from '../models/bond-data';

@Injectable({
  providedIn: 'root'
})
export class BondDataService {
  bond: BondData = {
    valorNominal: 1000.00,
    valorComercial: 1050.00,
    numeroAnios: 3,
    frecuenciaCupon: 180,
    diasCapitalizacion: 60,
    frecuenciaCuponTexto: 'Semestral',
    diasAnio: 360,
    tasaEfectivaAnual: 0.09,
    tipoTasaInteres: 'Efectiva',
    capitalizacion: 'Bimestral',
    tasaInteres: 0.09,
    tasaDescuentoAnual: 0.06,
    impuestoRenta: 0.30,
    fechaEmision: '05-01-2022',
    prima: 0.01,
    estructuracion: 0.0045,
    colocacion: 0.0025,
    flotacion: 0.0015,
    cavali: 0.005,
    costesInicialesEmisor: 14.175,
    costesInicialesBonista: 6.83,
    numeroPeriodosAnio: 2,
    numeroTotalPeriodos: 6,
    tasaEfectivaSemestral: 0.04403,
    cokSemestral: 0.0295630,
    precioActual: 1086.88,
    utilidad: 30.06,
    duracion: 2.72,
    convexidad: 8.66,
    duracionModificada: 2.64,
    tceaEmisor: 0.0801144,
    tceaEmisorEscudo: 0.0531371,
    treaBonista: 0.0720330
  };

  getBondData(): BondData {
    return this.bond;
  }
}
