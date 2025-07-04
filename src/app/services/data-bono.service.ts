import { Injectable } from '@angular/core';
import { InfoDataBono } from '../models/data_bono';

@Injectable({
    providedIn: 'root'
})
export class DataBonoService {
    private infoBondData: InfoDataBono | null = null;

    setInfoBondData(data: InfoDataBono): void {
        this.infoBondData = data;
    }

    getInfoBondData(): InfoDataBono | null {
        return this.infoBondData;
    }

    clearInfoBondData(): void {
        this.infoBondData = null;
    }
}
