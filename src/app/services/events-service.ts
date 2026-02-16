import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = `${environment.EVENTS_API}/api/events`;

  constructor(private http: HttpClient) {}

  track(evento: string, items: number, origen: string): Observable<any> {
    return this.http.post(this.url, { evento, items, origen });
  }
}
