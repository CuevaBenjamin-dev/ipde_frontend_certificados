import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces';

export interface UsuarioAdmin {
  id: number;
  usuario: string;
  role: 'ADMIN' | 'USER';
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private API_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  /** Obtener todos los usuarios */
  listarUsuarios(): Observable<ApiResponse<UsuarioAdmin[]>> {
    return this.http.get<ApiResponse<UsuarioAdmin[]>>(this.API_URL);
  }

  /** Crear usuario */
  crearUsuario(data: {
    usuario: string;
    password: string;
    role: 'ADMIN' | 'USER';
  }): Observable<ApiResponse<UsuarioAdmin>> {
    return this.http.post<ApiResponse<UsuarioAdmin>>(this.API_URL, data);
  }

  /** Eliminar usuario */
  eliminarUsuario(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.API_URL}/${id}`);
  }
}
