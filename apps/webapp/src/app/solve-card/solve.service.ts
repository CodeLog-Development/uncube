import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Solve } from './solve.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class SolveService {
  constructor(private http: HttpClient) { }

  update(solve: Solve): Observable<HttpResponse<never>> {
    return this.http.patch<never>(`${environment.apiUrl}/solve`, solve, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
