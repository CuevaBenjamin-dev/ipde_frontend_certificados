import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/interfaces';
import { environment } from '../../environments/environment.prod';

export interface DownloadEventRow {
  usuario: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class EventsAdminService {
  private url = `${environment.EVENTS_API}/api/events/admin/downloads`;

  constructor(private http: HttpClient) {}

  getDownloads(
    usuario: string,
    from?: string,
    to?: string,
  ): Observable<ApiResponse<DownloadEventRow[]>> {
    const token = localStorage.getItem('accessToken');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    let params = new HttpParams().set('usuario', usuario);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<ApiResponse<DownloadEventRow[]>>(this.url, { params, headers });
  }
}
