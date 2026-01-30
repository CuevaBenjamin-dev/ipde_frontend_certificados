import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private readonly API_URL = 'https://ipdebackendcertificados-production.up.railway.app/api/diplomas';

  constructor(private http: HttpClient) {}

  /** Envía múltiples modelos y recibe un solo PPTX */
  generarPPTX(payload: any): Observable<Blob> {
    return this.http.post(this.API_URL, payload, {
      responseType: 'blob',
    });
  }
}
