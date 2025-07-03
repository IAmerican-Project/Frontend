import { Injectable } from '@angular/core';
import { BondData } from '../models/bond-data';

@Injectable({
  providedIn: 'root'
})
export class BondDataService {
  private bond!: BondData;

  setBondData(bondData: BondData): void {
    this.bond = bondData;
  }

  getBondData(): BondData {
    if (!this.bond) {
      throw new Error('Bond data has not been initialized.');
    }
    return this.bond;
  }
}