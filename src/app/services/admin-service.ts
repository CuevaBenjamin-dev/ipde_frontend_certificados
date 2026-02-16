import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces';
import { environment } from '../../environments/environment.prod';

export interface UsuarioAdmin {
  id: number;
  usuario: string;
  role: 'ADMIN' | 'USER';
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private API_URL = `${environment.AUTH_API}/api/users`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  listarUsuarios(): Observable<ApiResponse<UsuarioAdmin[]>> {
    return this.http.get<ApiResponse<UsuarioAdmin[]>>(this.API_URL, {
      headers: this.authHeaders(),
    });
  }

  crearUsuario(data: {
    usuario: string;
    password: string;
    role: 'ADMIN' | 'USER';
  }): Observable<ApiResponse<UsuarioAdmin>> {
    return this.http.post<ApiResponse<UsuarioAdmin>>(this.API_URL, data, {
      headers: this.authHeaders(),
    });
  }

  eliminarUsuario(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
