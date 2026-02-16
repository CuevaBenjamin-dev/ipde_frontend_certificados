import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  private readonly API_URL = `${environment.DIPLOMAS_API}/api/diplomas`;
  // private readonly API_URL = 'https://ipdebackendcertificados-production.up.railway.app/api/diplomas';
  // private readonly API_URL = 'http://localhost:8000/api/diplomas';

  constructor(private http: HttpClient) {}

  /** Envía múltiples modelos y recibe un solo PPTX */
  generarPPTX(payload: any): Observable<Blob> {
    return this.http.post(this.API_URL, payload, {
      responseType: 'blob',
    });
  }
}
