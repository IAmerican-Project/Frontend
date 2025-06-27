import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bonus-simulation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: 'bonus-simulation.html',
  styleUrls: ['bonus-simulation.css']
})
export class BonusSimulation {

  precio_comercial: number | null = null;
  duracion: number | null = null;
  frecuencia_cupones: number = 30;
  fecha_emision: string = '';
  estructuracion: number | null = null;
  colocacion: number | null = null;
  flotacion: number | null = null;
  cavali: number | null = null;
  dias_capitalizacion: number | null = null;
  tipo_tasa: string = 'Efectiva';
  tasa_anual: number | null = null;
  tasa_descuento: number | null = null;
  impuesto_renta: number | null = null;
  moneda: number | null = null;
  dias_anio: number | null = null;
  tasa_igv: number | null = null;
  prima: number | null = null;
  valor_nominal_bono: number | null = null;

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
}
