import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subject, catchError, map, of, tap } from 'rxjs';
import { AuthRequest, CreateUserDto, User } from '@uncube/uncube-api';

export type RegisterResult =
  | { success: true; user: Partial<User> }
  | { success: false; message: string };

@Injectable()
export class AuthService {
  private isLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  login(authRequest: AuthRequest): Observable<string | undefined> {
    return this.http
      .post<undefined>(`${environment.apiUrl}/auth`, authRequest, {
        withCredentials: true,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(' 🚀 ~ auth.service.ts → Login failed', err);
          return of(err.error.message as string);
        }),
        map((data) => {
          if (!data) {
            return undefined;
          } else {
            return data;
          }
        }),
        tap((data) => {
          this.isLoggedIn.next(!data);
        })
      );
  }

  register(newUser: CreateUserDto): Observable<HttpResponse<Partial<User>>> {
    return this.http.post<Partial<User>>(
      `${environment.apiUrl}/user`,
      newUser,
      {
        observe: 'response',
        withCredentials: true,
      }
    );
  }

  get loggedIn() {
    return this.isLoggedIn.asObservable();
  }
}
