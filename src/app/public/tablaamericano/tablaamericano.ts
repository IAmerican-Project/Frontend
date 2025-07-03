import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {BondData} from '../../models/bond-data';
import {BondDataService} from '../../services/bond-data.service';
import {NgClass} from '@angular/common';
export interface FlujoDatos {
  nro: number;
  fechaProgramada: string | null;
  inflacionAnual: number | null;
  inflacionSemestral: number | null;
  plazoGracia: string | null;
  bono: number | null;
  bonoIndexado: number | null;
  cupon: number | null;
  cuota: number | null;
  amortizacion: number | null;
  prima: number | null;
  escudo: number | null;
  flujoEmisor: number | null;
  flujoEmisorEscudo: number | null;
  flujoBonista: number | null;
  flujoActualizado: number | null;
  faPorPlazo: number | null;
  factorConvexidad: number | null;
}

@Component({
  selector: 'tablaamericanoapp',
  templateUrl: './tablaamericano.html',
  imports: [
    MatFormField,
    MatSelectModule,
    MatFormFieldModule,
    MatLabel,
    MatPaginator,
    MatRow,
    MatNoDataRow,
    MatRowDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatCellDef,
    MatHeaderCellDef,
    MatTable,
    MatInput,
    MatHeaderCell,
    MatColumnDef,
    NgClass,
    MatCell,
    MatSort
  ],
  styleUrls: ['./tablaamericano.css']
})
export class TablaFlujoComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'nro',
    'fechaProgramada',
    'inflacionAnual',
    'inflacionSemestral',
    'plazoGracia',
    'bono',
    'bonoIndexado',
    'cupon',
    'cuota',
    'amortizacion',
    'prima',
    'escudo',
    'flujoEmisor',
    'flujoEmisorEscudo',
    'flujoBonista',
    'flujoActualizado',
    'faPorPlazo',
    'factorConvexidad'
  ];


  dataSource = new MatTableDataSource<FlujoDatos>();
  bondData!: BondData;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private bondService: BondDataService) {}
  ngAfterViewInit(): void {
    this.bondData = this.bondService.getBondData();
    const filas: FlujoDatos[] = [];



    const baseDate = new Date(this.bondData.fechaEmision);
    const frecuencia = this.bondData.frecuenciaCupon; // 180 días

    // Fila 0 (fecha de emisión)
    filas.push({
      nro: 0,
      fechaProgramada: this.bondData.fechaEmision, // formato DD/MM/YYYY
      inflacionAnual: null,
      inflacionSemestral: null,
      plazoGracia: null,
      bono: null,
      bonoIndexado: null,
      cupon: null,
      cuota: null,
      amortizacion: null,
      prima: null,
      escudo: null,
      flujoEmisor: this.bondData.valorComercial - this.bondData.costesInicialesEmisor,
      flujoEmisorEscudo: this.bondData.valorComercial - this.bondData.costesInicialesEmisor,
      flujoBonista: -this.bondData.valorComercial - this.bondData.costesInicialesBonista,
      flujoActualizado: null,
      faPorPlazo: null,
      factorConvexidad: null
    });
    let currentDate = new Date(this.bondData.fechaEmision);

    // Filas siguientes
    for (let i = 1; i <= this.bondData.numeroTotalPeriodos; i++) {
      if( i === 1) {
        currentDate.setDate(currentDate.getDate() + this.bondData.frecuenciaCupon+1);
      }
      else {
        currentDate.setDate(currentDate.getDate() + frecuencia);
      }
      const inflacionAnual = 0.00;
      const inflacionSemestral = (i <= this.bondData.numeroTotalPeriodos)
        ? ((Math.pow(1 + inflacionAnual / 100, frecuencia / this.bondData.diasAnio) - 1) * 100)
        : 0;
      const rowAnterior = filas[i - 1];
      let bonoCalculado = 0;
      if (i === 1) {
        bonoCalculado = this.bondData.valorNominal;
      } else if (i <= this.bondData.numeroTotalPeriodos) {
        if (rowAnterior.plazoGracia === 'T') {
          bonoCalculado = (rowAnterior.bonoIndexado ?? 0) - (rowAnterior.cupon ?? 0);
        } else {
          bonoCalculado = (rowAnterior.bonoIndexado ?? 0) + (rowAnterior.amortizacion ?? 0);
        }
      }
      const bonoIndexado = bonoCalculado * (1 + inflacionSemestral / 100);
      const cuponInteres=-bonoIndexado*this.bondData.tasaEfectivaSemestral;
      const plazoGracia = 'T'; // puedes personalizar esto si cambia dinámicamente
      let amortizacion = 0;
      let cuota = 0;
      if (i <= this.bondData.numeroTotalPeriodos) {
        if (i === this.bondData.numeroTotalPeriodos) {
          cuota = 0;
        } else {
          cuota = plazoGracia === 'T' ? 0 : cuponInteres + amortizacion;
        }
      }
      if (i <= this.bondData.numeroTotalPeriodos) {
        amortizacion = plazoGracia === 'T' ? 0 : -this.bondData.valorNominal / this.bondData.numeroTotalPeriodos;
      }
      else {
        amortizacion = 0;
        cuota = 0;

      }
      const prima = (i === this.bondData.numeroTotalPeriodos)
        ? -1 * (this.bondData.prima * this.bondData.valorNominal)
        : 0;
      const escudo =  ((-cuponInteres) * this.bondData.impuestoRenta);
      let flujoEmisorN = 0;
      if (i <= this.bondData.numeroTotalPeriodos) {
        flujoEmisorN = cuota + prima;
      }

      const  flujoEmisorEscudo = flujoEmisorN + escudo;
      const flujoBonista = -flujoEmisorN;

      let flujoActualizadoPreciso  = 0;

      if (i > 0) {
        flujoActualizadoPreciso = (flujoBonista ?? 0) / Math.pow(1 + this.bondData.cokSemestral, i);
      }
      const flujoActualizado = flujoActualizadoPreciso; // versión visible/redondeada

      let faPorPlazo = 0;
      if (i > 0) {
        faPorPlazo = flujoActualizadoPreciso * i * this.bondData.frecuenciaCupon / this.bondData.diasAnio;
      }
      let factorConvexidad = 0;
      if (i > 0) {
        factorConvexidad = flujoActualizadoPreciso  * i * (1 + i);
      }

      filas.push({
        nro: i,
        fechaProgramada: currentDate.toISOString().split('T')[0],
        inflacionAnual: inflacionAnual,
        inflacionSemestral: parseFloat(inflacionSemestral.toFixed(3)),
        plazoGracia: 'T',
        bono: bonoCalculado,
        bonoIndexado: bonoIndexado,
        cupon: cuponInteres,
        cuota: cuota,
        amortizacion: amortizacion,
        prima: prima,
        escudo: escudo,
        flujoEmisor: flujoEmisorN,
        flujoEmisorEscudo: flujoEmisorEscudo,
        flujoBonista: flujoBonista,
        flujoActualizado: flujoActualizado,
        faPorPlazo: faPorPlazo,
        factorConvexidad: factorConvexidad
      });
    }

    this.dataSource.data = filas;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }




  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChangePlazoGracia(value: 'T' | 'S', row: FlujoDatos): void {
    row.plazoGracia = value;

    const index = this.dataSource.data.findIndex(f => f.nro === row.nro);
    if (index === -1 || index === 0) return;

    for (let i = index; i < this.dataSource.data.length; i++) {
      const currentRow = this.dataSource.data[i];
      const prevRow = this.dataSource.data[i - 1];

      let bonoCalculado = 0;
      if (i === 1) {
        bonoCalculado = this.bondData.valorNominal;
      } else {
        if (prevRow.plazoGracia === 'T') {
          bonoCalculado = (prevRow.bonoIndexado ?? 0) - (prevRow.cupon ?? 0);
        } else {
          bonoCalculado = (prevRow.bonoIndexado ?? 0) + (prevRow.amortizacion ?? 0);
        }
      }

      const inflacionSemestral = currentRow.inflacionSemestral ?? 0;
      const bonoIndexado = bonoCalculado * (1 + inflacionSemestral / 100);
      const cuponInteres = -bonoIndexado * this.bondData.tasaEfectivaSemestral;

      currentRow.bono = bonoCalculado;
      currentRow.bonoIndexado = bonoIndexado;
      currentRow.cupon = cuponInteres;

      let amortizacion = 0;
      if (i > this.bondData.numeroTotalPeriodos) {
        amortizacion = 0;
      } else if (i <= this.bondData.numeroTotalPeriodos - 1) {
        amortizacion = 0;
      } else if (i === this.bondData.numeroTotalPeriodos) {
        amortizacion = -bonoIndexado;
      }
      currentRow.amortizacion = amortizacion;

      let cuota = 0;
      if (i <= this.bondData.numeroTotalPeriodos) {
        if (i === this.bondData.numeroTotalPeriodos && currentRow.plazoGracia === 'T') {
          cuota = 0;
        } else if (i === this.bondData.numeroTotalPeriodos) {
          cuota = cuponInteres + amortizacion;
        } else if (currentRow.plazoGracia === 'T') {
          cuota = 0;
        } else {
          cuota = cuponInteres + amortizacion;
        }
      } else {
        cuota = 0;
      }
      currentRow.escudo = ((-cuponInteres) * this.bondData.impuestoRenta);
      let prima = 0;
      if (i === this.bondData.numeroTotalPeriodos) {
        prima = this.bondData.prima * this.bondData.valorNominal * -1;
      }
      currentRow.prima = prima;
      currentRow.cuota = cuota;
      let flujoEmisor = 0;
      if (i <= this.bondData.numeroTotalPeriodos) {
        flujoEmisor = cuota + currentRow.prima;
      }
      currentRow.flujoEmisor = flujoEmisor;
      currentRow.flujoEmisorEscudo = currentRow.flujoEmisor+ currentRow.escudo;
      currentRow.flujoBonista= -flujoEmisor;
      let flujoActualizadoPreciso = 0;
      if (i > 0) {
        flujoActualizadoPreciso = (currentRow.flujoBonista ?? 0) / Math.pow(1 + this.bondData.cokSemestral, i);
      }
      currentRow.flujoActualizado = flujoActualizadoPreciso ;
      let faPorPlazo = 0;
      if (i > 0) {
        faPorPlazo = flujoActualizadoPreciso  * i * this.bondData.frecuenciaCupon / this.bondData.diasAnio;
      }
      currentRow.faPorPlazo = faPorPlazo;
      let factorConvexidad = 0;
      if (i > 0) {
        factorConvexidad = flujoActualizadoPreciso  * i * (1 + i);
      }
      currentRow.factorConvexidad = factorConvexidad;
    }

    // Forzar la actualización visual
    this.dataSource._updateChangeSubscription();
  }

  roundUpTwoDecimals(value: number): number {
    return Math.ceil(value * 100) / 100;
  }

  roundUpThreeDecimals(value: number): number {
    return Math.ceil(value * 1000) / 1000;
  }


  formatWithParentheses(value: number | null): string {
    if (value === null) return '';
    return value < 0 ? `(${Math.abs(this.roundUpTwoDecimals(value)).toFixed(2)})` : this.roundUpTwoDecimals(value).toFixed(2);
  }

  isNegative(value: number | null): boolean {
    return value !== null && value < 0;
  }

  formatDate(fecha: string | Date | null): string {
    if (!fecha) return '';
    const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  formatNumberWithStyle(value: number | null): string {
    if (value === null || value === undefined) return '';

    const formatted = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(value));

    return value < 0 ? `(${formatted})` : formatted;
  }

  formatNumber(value: number | null): string {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

}
