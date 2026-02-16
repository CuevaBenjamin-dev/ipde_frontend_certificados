import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = `${environment.EVENTS_API}/api/events`;

  constructor(private http: HttpClient) {}

  track(evento: string, items: number, origen: string): Observable<any> {
    const token = localStorage.getItem('accessToken');

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();

    return this.http.post(this.url, { evento, items, origen }, { headers });
  }
}
