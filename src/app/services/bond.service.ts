import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import { Bono } from '../models/bono.model';

@Injectable({ providedIn: 'root' })
export class BondService {
  private url = `${environment.apiUrl}/bonos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bono[]> {
    return this.http.get<Bono[]>(this.url);
  }

  getById(id: number): Observable<Bono> {
    return this.http.get<Bono>(`${this.url}/${id}`);
  }

  create(bono: Bono): Observable<Bono> {
    return this.http.post<Bono>(this.url, bono);
  }

  update(id: number, bono: Bono): Observable<Bono> {
    return this.http.put<Bono>(`${this.url}/${id}`, bono);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
