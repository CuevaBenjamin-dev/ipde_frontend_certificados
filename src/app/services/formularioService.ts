import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormularioService {
  // private readonly API_URL =
  //   'https://ipdebackendcertificados-production.up.railway.app/api/diplomas';
  // private readonly API_URL = 'http://localhost:8001/api/diplomas';
  // private readonly API_URL = 'https://legwork-sulfide-slacking.ngrok-free.dev/api/diplomas';
  private readonly API_URL = 'https://diplomas-back.onrender.com/api/diplomas';

  constructor(private http: HttpClient) {}

  /** Envía múltiples modelos y recibe el PPTX con headers incluidos */
  generarPPTX(payload: any): Observable<HttpResponse<Blob>> {
    return this.http.post(this.API_URL, payload, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
