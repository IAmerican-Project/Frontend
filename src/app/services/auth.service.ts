import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<Usuario | null>(null);

    constructor(private http: HttpClient) {}

    login(username: string, password: string): Observable<Usuario | null> {
        return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios?username=${username}&password=${password}`)
            .pipe(
                map((users: Usuario[]) => {
                    if (users.length > 0) {
                        this.currentUserSubject.next(users[0]);
                        localStorage.setItem('user', JSON.stringify(users[0]));
                        return users[0];
                    }
                    return null;
                })
            );
    }

    logout(): void {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }

    get currentUser(): Usuario | null {
        return this.currentUserSubject.value;
    }
}
