import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {DataService} from "../services/data.service";
import {TablaFlujoComponent} from "../public/tablaamericano/tablaamericano";

@Component({
  selector: 'app-results',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TablaFlujoComponent
  ],
  templateUrl: 'results.html',
  standalone: true,
  styleUrl: 'results.css'
})
export class Results {
  tasa_efectiva_anual: any;
  duracion: any;
  convexidad: any;
  total_ratios: any;
  duracion_modificada: any;
  costes_iniciales_emisor: any;
  costes_iniciales_bonista: any;
  precio_actual: any;
  utilidad: any;
  tce: any;
  trea: any;
  tcea: any;
  numero_periodos_anio: any;
  total_periodos: any;
  tasa_efectiva: any;
  cok: any;

  constructor(private dataService: DataService) {
    const datos = this.dataService.datosCalculadora;
    this.costes_iniciales_emisor = this.calcularCostosInicialesEmisor(datos);
    this.costes_iniciales_bonista = this.calcularCostosInicialesBonista(datos);
    this.numero_periodos_anio = this.numeroPeriodosAnio(datos);
    this.total_periodos = this.totalPeriodos(datos);
    this.cok = this.Cok(datos);
    this.tasa_efectiva_anual = this.tasaEfectivaAnual(datos);
    this.tasa_efectiva = this.tasaEfectiva(datos);
  }

  totalPeriodos(datos: any): number {
    const { numero_anio } = datos;
    const periodosPorAnio = this.numeroPeriodosAnio(datos);
    const total = periodosPorAnio * numero_anio;

    return Number(total.toFixed(2));
  }

  numeroPeriodosAnio(datos: any): number {
    const { dias_anio, frecuencia_cupon } = datos;
    const total = dias_anio / frecuencia_cupon;
    return Number(total.toFixed(2));
  }

  calcularCostosInicialesEmisor(datos: any): number {
    const { estructuracion, colocacion, flotacion, cavali, valor_comercial } = datos;
    const total = ((estructuracion ?? 0) + (colocacion ?? 0) + (flotacion ?? 0) + (cavali ?? 0))*valor_comercial;
    return Number(total.toFixed(2));
  }
  calcularCostosInicialesBonista(datos: any): number {
    const { flotacion, cavali, valor_comercial } = datos;
    const total = ((flotacion ?? 0) + (cavali ?? 0))*valor_comercial;
    return Number(total.toFixed(2));
  }

  Cok(datos: any): number {
    const { tasa_anual_descuento, dias_anio, frecuencia_cupon } = datos;
    const total = Math.pow(1 + tasa_anual_descuento, frecuencia_cupon / dias_anio) - 1;
    return Number(total.toFixed(6));
  }


  tasaEfectivaAnual(datos: any): number {
    const { dias_anio, tipo_tasa_interes, tasa_interes, dias_capitalizacion } = datos;

    if (tipo_tasa_interes === 'Efectiva') {
      return Number(tasa_interes.toFixed(6));
    }

    const m = dias_anio / dias_capitalizacion;
    const tasa_efectiva = Math.pow(1 + (tasa_interes / m), m) - 1;
    return Number(tasa_efectiva.toFixed(6));
  }

  tasaEfectiva(datos: any): number {
    const { dias_anio, frecuencia_cupon } = datos;

    const tasa_efectiva_anual = this.tasaEfectivaAnual(datos);
    const exponente = frecuencia_cupon / dias_anio;
    const tasa_semestral = Math.pow(1 + tasa_efectiva_anual, exponente) - 1;

    return Number(tasa_semestral.toFixed(6));
  }

}
