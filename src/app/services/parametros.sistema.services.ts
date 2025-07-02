

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1️⃣ Importa tu interfaz de datos, no el servicio
import { ParametrosSistema } from '../models/parametros-sistema.model';

@Injectable({
  providedIn: 'root'
})
export class ParametrosSistemaService {
  private apiUrl = 'http://localhost:3000/parametros_sistema';

  constructor(private http: HttpClient) {}

  // 2️⃣ Devuelve Observable<ParametrosSistema[]>
  getParametros(): Observable<ParametrosSistema[]> {
    return this.http.get<ParametrosSistema[]>(this.apiUrl);
  }

  // 3️⃣ updateParametros recibe ParametrosSistema, no el servicio
  updateParametros(
      id: number,
      datos: ParametrosSistema
  ): Observable<ParametrosSistema> {
    return this.http.put<ParametrosSistema>(
        `${this.apiUrl}/${id}`,
        datos
    );
  }
}
