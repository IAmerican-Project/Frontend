import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {DataService} from "../services/data.service";
import {BondDataService} from "../services/bond-data.service";
import {DataBonoService} from "../services/data-bono.service";
import { InfoDataBono } from '../models/data_bono';
import {Navbar} from "../shared/navbar/navbar";

@Component({
  selector: 'app-bonus-simulation',
  standalone: true,
    imports: [FormsModule, CommonModule, Navbar],
  templateUrl: 'bonus-simulation.html',
  styleUrls: ['bonus-simulation.css']
})
export class CalculadoraMultiplicacion {
  constructor(private dataService: DataService, private router: Router, private bondDataService: BondDataService, private dataBonoService :DataBonoService) { }

  precio_comercial: number | null = null;
  cantidad_anios: number | null = null;
  dias_anio: number = 360;
  frecuencia_cupones: number = 30;
  fecha_emision: string = '';
  estructuracion: number | null = null;
  colocacion: number | null = null;
  flotacion: number | null = null;
  cavali: number | null = null;
  dias_capitalizacion: number = 1;
  tipo_tasa: string = 'Efectiva';
  tasa_anual: number | null = null;
  tasa_descuento: number | null = null;
  impuesto_renta: number | null = null;
  prima: number | null = null;
  valor_nominal_bono: number | null = null;

  guardarTodo(): void {
    // Guarda en DataService
    this.dataService.datosCalculadora = {
      valor_comercial: this.precio_comercial,
      valor_nominal_bono: this.valor_nominal_bono,
      numero_anio: this.cantidad_anios,
      frecuencia_cupon: this.frecuencia_cupones,
      dias_anio: this.dias_anio,
      tipo_tasa_interes: this.tipo_tasa,
      dias_capitalizacion: this.dias_capitalizacion,
      tasa_interes: (this.tasa_anual ?? 0) / 100,
      tasa_anual_descuento: (this.tasa_descuento ?? 0) / 100,
      impuesto_renta: (this.impuesto_renta ?? 0) / 100,
      prima: (this.prima ?? 0) / 100,
      estructuracion: (this.estructuracion ?? 0) / 100,
      colocacion: (this.colocacion ?? 0) / 100,
      flotacion: (this.flotacion ?? 0) / 100,
      cavali: (this.cavali ?? 0) / 100,
      fecha_emision: this.fecha_emision
    };


    // Guarda en DataBonoService
    const infoBono: InfoDataBono = {
      i_valor_nominal_bono: this.valor_nominal_bono,
      i_precio_comercial: this.precio_comercial,
      i_numero_de_anios: this.cantidad_anios,
      i_frecuencia_cupones: this.frecuencia_cupones,
      i_dias_capitalizacion: this.dias_capitalizacion,
      i_dias_anio: this.dias_anio,
      i_tasa_interes:(this.tasa_anual ?? 0) / 100,/////
      i_tasa_descuento_anual: (this.tasa_descuento ?? 0)/100,
      i_impuesto_renta: (this.impuesto_renta ?? 0) / 100,
      i_prima: (this.prima ?? 0)/100,
      i_estructuracion: (this.estructuracion ?? 0)/100,
      i_colocacion: (this.colocacion ?? 0)/100,
      i_flotacion: (this.flotacion ?? 0)/100,
      i_cavali: (this.cavali ?? 0)/100
    };
    this.dataBonoService.setInfoBondData(infoBono);

    // Redirige a /results
    this.router.navigate(['/results']);
  }
  get primaDecimal(): number {
    return (this.prima ?? 0) / 100;
  }

  get estructuracionDecimal(): number {
    return (this.estructuracion ?? 0) / 100;
  }

  get colocacionDecimal(): number {
    return (this.colocacion ?? 0) / 100;
  }

  get flotacionDecimal(): number {
    return (this.flotacion ?? 0) / 100;
  }

  get cavaliDecimal(): number {
    return (this.cavali ?? 0) / 100;
  }

  get tasaEfectivaAnual(): number | null {
    if (this.tasa_anual == null || this.tipo_tasa !== 'Nominal' || !this.dias_capitalizacion) {
      return this.tasa_anual ?? null;
    }
    const m = 360 / this.dias_capitalizacion;
    const tasaNominalDecimal = this.tasa_anual / 100;
    const tasaEfectiva = (Math.pow(1 + tasaNominalDecimal / m, m) - 1) * 100;
    return parseFloat(tasaEfectiva.toFixed(6));
  }
}
