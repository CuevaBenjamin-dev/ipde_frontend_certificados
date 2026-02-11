import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private url = 'http://localhost:8082/api/events';

  constructor(private http: HttpClient) {}

  track(evento: string, items: number, origen: string): Observable<any> {
    return this.http.post(this.url, { evento, items, origen });
  }
}
