import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, ApiResponse, AuthTokens } from '../models/interfaces';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.AUTH_API;

  constructor(private http: HttpClient) {}

  /**
   * Login del usuario.
   *
   * NIVEL 4:
   * - Devuelve accessToken y refreshToken
   */
  login(request: LoginRequest): Observable<ApiResponse<AuthTokens>> {
    return this.http.post<ApiResponse<AuthTokens>>(
      this.apiUrl,
      request,
      { withCredentials: true }, // 🔥 CLAVE para que el browser acepte la cookie
    );
  }

  /**
   * REFRESH TOKEN - NIVEL 7
   *
   * - NO se envía body
   * - El refresh token viaja automáticamente en cookie HttpOnly
   */
  refreshToken(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/auth/refresh`, 
      {},
      { withCredentials: true }, // 🔑 OBLIGATORIO para cookies
    );
  }

  /**
   * LOGOUT - NIVEL 8
   *
   * - El backend borra cookie HttpOnly
   * - Revoca refresh tokens
   */
  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/auth/logout`,
      {},
      { withCredentials: true },
    );
  }

  /**
   * Lee el role desde el accessToken (solo para UX).
   * OJO: esto NO reemplaza la seguridad del backend.
   */
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
