import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from "../services/data.service";
import { TablaFlujoComponent } from "../public/tablaamericano/tablaamericano";
import { BondDataService } from "../services/bond-data.service";
import { InfoDataBono } from "../models/data_bono";
import { DataBonoService } from "../services/data-bono.service";
import { FlujoService } from "../services/flujo.service"; 

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
  tce: number;
  trea: number;
  tcea: number;
  numero_periodos_anio: any;
  total_periodos: any;
  tasa_efectiva: any;
  cok: any;
  infoDataBono: InfoDataBono | null = null;


  constructor(
      private dataService: DataService,
      private bondService: BondDataService,
      private dataBonoService: DataBonoService,
      private flujoService: FlujoService // NUEVO
  ) {
    const datos = this.dataService.datosCalculadora;

    this.costes_iniciales_emisor = this.calcularCostosInicialesEmisor(datos);
    this.costes_iniciales_bonista = this.calcularCostosInicialesBonista(datos);
    this.numero_periodos_anio = this.numeroPeriodosAnio(datos);
    this.total_periodos = this.totalPeriodos(datos);
    this.cok = this.Cok(datos);
    this.tasa_efectiva_anual = this.tasaEfectivaAnual(datos);
    this.tasa_efectiva = this.tasaEfectiva(datos);


    const infoDataBono = this.dataBonoService.getInfoBondData();

    const bondData = {
      valorNominal: infoDataBono?.i_valor_nominal_bono ?? 0,
      valorComercial: infoDataBono?.i_precio_comercial ?? 0,
      numeroAnios: infoDataBono?.i_numero_de_anios ?? 0,
      frecuenciaCupon: infoDataBono?.i_frecuencia_cupones ?? 0,
      diasCapitalizacion: infoDataBono?.i_dias_capitalizacion ?? 0,
      frecuenciaCuponTexto: '',
      diasAnio: infoDataBono?.i_dias_anio ?? 360,
      tasaEfectivaAnual: this.tasa_efectiva_anual,
      tipoTasaInteres: '',
      capitalizacion: '',
      tasaInteres: infoDataBono?.i_tasa_interes ?? 0,
      tasaDescuentoAnual: infoDataBono?.i_tasa_descuento_anual ?? 0,
      impuestoRenta: infoDataBono?.i_impuesto_renta ?? 0,
      fechaEmision: datos.fecha_emision,
      prima: infoDataBono?.i_prima ?? 0,
      estructuracion: infoDataBono?.i_estructuracion ?? 0,
      colocacion: infoDataBono?.i_colocacion ?? 0,
      flotacion: infoDataBono?.i_flotacion ?? 0,
      cavali: infoDataBono?.i_cavali ?? 0,
      costesInicialesEmisor: this.costes_iniciales_emisor,
      costesInicialesBonista: this.costes_iniciales_bonista,
      numeroPeriodosAnio: this.numero_periodos_anio,
      numeroTotalPeriodos: this.total_periodos,
      tasaEfectivaSemestral: this.tasa_efectiva,
      cokSemestral: this.cok,
      precioActual: 0,
      utilidad: 0,
      duracion: 0,
      convexidad: 0,
      duracionModificada: 0,
      tceaEmisor: 0,
      tceaEmisorEscudo: 0,
      treaBonista: 0,

    };

    this.bondService.setBondData(bondData);

    const flujo = this.flujoService.generarFlujo(bondData);


    this.precio_actual = this.flujoService.calcularPrecioActual(flujo, bondData.cokSemestral);
    this.utilidad = -this.flujoService.calcularUtilidad(flujo, this.precio_actual);
    this.duracion = this.flujoService.calcularDuracion(flujo);
    this.convexidad = this.flujoService.calcularConvexidad(flujo, bondData.cokSemestral, bondData.numeroTotalPeriodos);
    this.total_ratios = Number((this.duracion + this.convexidad).toFixed(6));
    this.duracion_modificada = Number((this.duracion / (1 + this.cok)).toFixed(6));
    this.tce = this.flujoService.calcularTCEAEmisor(flujo);
    this.tcea = this.flujoService.calcularTCEAEmisorConEscudo(flujo);
    this.trea = this.flujoService.calcularTREA(flujo);


  }


  calcularCostosInicialesEmisor(datos: any): number {
    const { estructuracion, colocacion, flotacion, cavali, valor_comercial } = datos;
    const total = ((estructuracion ?? 0) + (colocacion ?? 0) + (flotacion ?? 0) + (cavali ?? 0)) * valor_comercial;
    return Number(total.toFixed(2));
  }

  calcularCostosInicialesBonista(datos: any): number {
    const { flotacion, cavali, valor_comercial } = datos;
    const total = ((flotacion ?? 0) + (cavali ?? 0)) * valor_comercial;
    return Number(total.toFixed(2));
  }

  numeroPeriodosAnio(datos: any): number {
    const { dias_anio, frecuencia_cupon } = datos;
    const total = dias_anio / frecuencia_cupon;
    return Number(total.toFixed(2));
  }

  totalPeriodos(datos: any): number {
    const { numero_anio } = datos;
    const periodosPorAnio = this.numeroPeriodosAnio(datos);
    const total = periodosPorAnio * numero_anio;
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
