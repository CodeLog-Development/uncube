import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { AuthRequest } from '@uncube/uncube-api';

@Injectable()
export class AuthService {
  private isLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  login(authRequest: AuthRequest): Observable<boolean> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth`, authRequest, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(' 🚀 ~ auth.service.ts → Login failed', err);
          return of(undefined);
        }),
        map((data) => {
          return !!data?.ok;
        }),
        tap((success) => {
          this.isLoggedIn.next(success);
        })
      );
  }

  get loggedIn() {
    return this.isLoggedIn.asObservable();
  }
}
