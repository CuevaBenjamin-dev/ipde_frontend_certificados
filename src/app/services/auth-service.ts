import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginRequest, ApiResponse, AuthTokens } from '../models/interfaces';
import { environment } from '../../environments/environment.prod';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.AUTH_API;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<ApiResponse<AuthTokens>> {
    return this.http
      .post<ApiResponse<AuthTokens>>(`${this.apiUrl}/auth/login`, request, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          const tokens = res?.data;
          if (tokens?.accessToken) {
            localStorage.setItem('accessToken', tokens.accessToken);
          }
        }),
      );
  }

  refreshToken(): Observable<ApiResponse<string>> {
    return this.http
      .post<ApiResponse<string>>(`${this.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => {
          // Aquí depende de tu backend:
          // Si refresh devuelve un NUEVO accessToken como string en data:
          if (res?.data) {
            localStorage.setItem('accessToken', res.data);
          }
        }),
      );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http
      .post<ApiResponse<null>>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(tap(() => localStorage.removeItem('accessToken')));
  }

  getRole(): 'ADMIN' | 'USER' | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch {
      return null;
    }
  }
}
