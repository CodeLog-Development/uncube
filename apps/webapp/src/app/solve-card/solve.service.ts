import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Solve } from './solve.interface';
import { Injectable } from '@angular/core';
import { CreateSolveDto, SolveList } from '@uncube/uncube-api';

@Injectable()
export class SolveService {
  constructor(private http: HttpClient) {}

  update(id: string, solve: Solve): Observable<HttpResponse<never>> {
    return this.http.patch<never>(`${environment.apiUrl}/solve/${id}`, solve, {
      observe: 'response',
      withCredentials: true,
    });
  }

  create(solve: CreateSolveDto): Observable<HttpResponse<Solve>> {
    return this.http.post<Solve>(`${environment.apiUrl}/solve`, solve, {
      observe: 'response',
      withCredentials: true,
    });
  }

  getSolves(): Observable<HttpResponse<SolveList>> {
    return this.http.get<SolveList>(`${environment.apiUrl}/solve`, {
      observe: 'response',
      withCredentials: true,
    });
  }

  deleteSolve(id: string): Observable<HttpResponse<never>> {
    return this.http.delete<never>(`${environment.apiUrl}/solve/${id}`, {
      observe: 'response',
      withCredentials: true,
    });
  }
}
