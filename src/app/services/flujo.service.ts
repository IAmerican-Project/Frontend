import { Injectable } from '@angular/core';
import { FlujoDatos } from '../public/tablaamericano/tablaamericano';
import { BondData } from '../models/bond-data';

@Injectable({
  providedIn: 'root'
})
export class FlujoService {
  constructor() {}

  generarFlujo(bondData: BondData): FlujoDatos[] {
    const filas: FlujoDatos[] = [];
    const baseDate = new Date(bondData.fechaEmision ?? new Date());
    const frecuencia = bondData.frecuenciaCupon;
    const diasAnio = bondData.diasAnio;

    // Fila inicial (nro 0)
    filas.push({
      nro: 0,
      fechaProgramada: bondData.fechaEmision,
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
      flujoEmisor: bondData.valorComercial - bondData.costesInicialesEmisor,
      flujoEmisorEscudo: bondData.valorComercial - bondData.costesInicialesEmisor,
      flujoBonista: -bondData.valorComercial - bondData.costesInicialesBonista,
      flujoActualizado: null,
      faPorPlazo: null,
      factorConvexidad: null
    });

    let currentDate = new Date(baseDate); // Conservamos esto fuera del bucle

    for (let i = 1; i <= bondData.numeroTotalPeriodos; i++) {
      currentDate.setDate(currentDate.getDate() + (i === 1 ? frecuencia + 1 : frecuencia));


      const inflacionAnual = 0;
      const inflacionSemestral = (Math.pow(1 + inflacionAnual / 100, frecuencia / diasAnio) - 1) * 100;

      const rowAnterior = filas[i - 1];
      let bonoCalculado = (i === 1)
          ? bondData.valorNominal
          : (rowAnterior.bonoIndexado ?? 0) - (rowAnterior.cupon ?? 0);

      const bonoIndexado = bonoCalculado * (1 + inflacionSemestral / 100);
      const cupon = -bonoIndexado * bondData.tasaEfectivaSemestral;
      const amortizacion = 0;
      const cuota = 0;
      const prima = (i === bondData.numeroTotalPeriodos)
          ? -1 * (bondData.prima * bondData.valorNominal)
          : 0;
      const escudo = -cupon * bondData.impuestoRenta;
      const flujoEmisor = cuota + prima;
      const flujoEmisorEscudo = flujoEmisor + escudo;
      const flujoBonista = -flujoEmisor;
      const flujoActualizado = flujoBonista / Math.pow(1 + bondData.cokSemestral, i);
      const faPorPlazo = flujoActualizado * i * frecuencia / diasAnio;
      const factorConvexidad = flujoActualizado * i * (1 + i);

      filas.push({
        nro: i,
        fechaProgramada: currentDate.toISOString().split('T')[0],
        inflacionAnual,
        inflacionSemestral,
        plazoGracia: 'T',
        bono: bonoCalculado,
        bonoIndexado,
        cupon,
        cuota,
        amortizacion,
        prima,
        escudo,
        flujoEmisor,
        flujoEmisorEscudo,
        flujoBonista,
        flujoActualizado,
        faPorPlazo,
        factorConvexidad
      });
    }

    return filas;
  }

  calcularPrecioActual(flujo: FlujoDatos[], cok: number): number {
    const flujosFiltrados = flujo.filter(f => f.nro > 0 && f.flujoBonista !== null);
    const vna = flujosFiltrados.reduce((acum, f) => {
      const actualizado = (f.flujoBonista ?? 0) / Math.pow(1 + cok, f.nro);
      return acum + actualizado;
    }, 0);
    return Number(vna.toFixed(2));
  }



  calcularDuracion(flujo: FlujoDatos[]): number {
    const flujoValido = flujo.filter(f => f.nro > 0 && f.faPorPlazo !== null && f.flujoActualizado !== null);

    const sumaFaPorPlazo = flujoValido.reduce((acum, f) => acum + (f.faPorPlazo ?? 0), 0);
    const sumaFlujoActualizado = flujoValido.reduce((acum, f) => acum + (f.flujoActualizado ?? 0), 0);

    if (sumaFlujoActualizado === 0) return 0;

    const duracion = sumaFaPorPlazo / sumaFlujoActualizado;
    return Number(duracion.toFixed(6));
  }

  calcularConvexidad(flujo: FlujoDatos[], cok: number, totalPeriodos: number): number {
    const flujoValido = flujo.filter(f => f.nro > 0 && f.factorConvexidad !== null && f.flujoActualizado !== null);

    const sumaFactorConvexidad = flujoValido.reduce((acum, f) => acum + (f.factorConvexidad ?? 0), 0);
    const sumaFlujoActualizado = flujoValido.reduce((acum, f) => acum + (f.flujoActualizado ?? 0), 0);

    if (sumaFlujoActualizado === 0 || totalPeriodos === 0) return 0;

    const denominador = Math.pow(1 + cok, 2) * Math.pow(totalPeriodos, 2);
    const convexidad = sumaFactorConvexidad / (denominador * sumaFlujoActualizado);

    return Number(convexidad.toFixed(6));
  }


  calcularUtilidad(flujo: FlujoDatos[], precioActual: number): number {
    const flujoInicial = flujo.find(f => f.nro === 0)?.flujoBonista ?? 0;
    const utilidad = flujoInicial + precioActual;
    return Number(utilidad.toFixed(2));
  }

  calcularTCEAEmisor(flujo: any[]): number {
    const flujos = flujo
        .filter(f => f.nro >= 0 && f.flujoEmisor !== null && f.fechaProgramada)
        .map(f => ({
          valor: f.flujoEmisor!,
          fecha: new Date(f.fechaProgramada!)
        }));

    if (flujos.length < 2) return 0;

    const fechaInicial = flujos[0].fecha.getTime();

    const tirIterativa = (tasaInicial = 0.1): number => {
      let tasa = tasaInicial;
      const maxIter = 1000;
      const precision = 1e-7;

      for (let i = 0; i < maxIter; i++) {
        let valorActual = 0;
        let derivada = 0;

        for (const flujo of flujos) {
          const t = (flujo.fecha.getTime() - fechaInicial) / (1000 * 3600 * 24 * 365); // años
          const descuento = Math.pow(1 + tasa, t);
          valorActual += flujo.valor / descuento;
          derivada -= (t * flujo.valor) / (descuento * (1 + tasa));
        }

        const nuevaTasa = tasa - valorActual / derivada;
        if (Math.abs(nuevaTasa - tasa) < precision) return nuevaTasa;
        tasa = nuevaTasa;
      }

      return tasa;
    };

    const tir = tirIterativa();
    return Number((tir * 100).toFixed(6)); // en porcentaje
  }

  calcularTCEAEmisorConEscudo(flujo: any[]): number {
    const flujos = flujo
        .filter(f => f.nro >= 0 && f.flujoEmisorEscudo !== null && f.fechaProgramada)
        .map(f => ({
          valor: f.flujoEmisorEscudo!,
          fecha: new Date(f.fechaProgramada!)
        }));

    if (flujos.length < 2) return 0;

    const fechaInicial = flujos[0].fecha.getTime();

    const tirIterativa = (tasaInicial = 0.1): number => {
      let tasa = tasaInicial;
      const maxIter = 1000;
      const precision = 1e-7;

      for (let i = 0; i < maxIter; i++) {
        let valorActual = 0;
        let derivada = 0;

        for (const flujo of flujos) {
          const t = (flujo.fecha.getTime() - fechaInicial) / (1000 * 3600 * 24 * 365); // años
          const descuento = Math.pow(1 + tasa, t);
          valorActual += flujo.valor / descuento;
          derivada -= (t * flujo.valor) / (descuento * (1 + tasa));
        }

        const nuevaTasa = tasa - valorActual / derivada;
        if (Math.abs(nuevaTasa - tasa) < precision) return nuevaTasa;
        tasa = nuevaTasa;
      }

      return tasa;
    };

    const tir = tirIterativa();
    return Number((tir * 100).toFixed(6)); // en porcentaje
  }

  calcularTREA(flujo: any[]): number {
    const flujos = flujo
        .filter(f => f.nro >= 0 && f.flujoBonista !== null && f.fechaProgramada)
        .map(f => ({
          valor: f.flujoBonista!,
          fecha: new Date(f.fechaProgramada!)
        }));

    if (flujos.length < 2) return 0;

    const fechaInicial = flujos[0].fecha.getTime();

    const tirIterativa = (tasaInicial = 0.1): number => {
      let tasa = tasaInicial;
      const maxIter = 1000;
      const precision = 1e-7;

      for (let i = 0; i < maxIter; i++) {
        let valorActual = 0;
        let derivada = 0;

        for (const flujo of flujos) {
          const t = (flujo.fecha.getTime() - fechaInicial) / (1000 * 3600 * 24 * 365);
          const descuento = Math.pow(1 + tasa, t);
          valorActual += flujo.valor / descuento;
          derivada -= (t * flujo.valor) / (descuento * (1 + tasa));
        }

        const nuevaTasa = tasa - valorActual / derivada;
        if (Math.abs(nuevaTasa - tasa) < precision) return nuevaTasa;
        tasa = nuevaTasa;
      }

      return tasa;
    };

    const tir = tirIterativa();
    return Number((tir * 100).toFixed(6));
  }





}
