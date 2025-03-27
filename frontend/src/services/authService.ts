import type { AuthResponse, Claims, RefreshTokenResponse, UserResponse } from '@/interfaces/auth';
import { tap, type Observable } from 'rxjs';
import { useHttp } from './httpService';
import { useAuthStore } from '@/stores/authStore';

export class AuthService {
  private http = useHttp();
  private store;

  constructor() {
    this.store = useAuthStore();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${import.meta.env.VITE_API_URL}/auth`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.store.login(response);
        }),
      );
  }

  register(username: string, email: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${import.meta.env.VITE_API_URL}/user`, {
      username,
      email,
      password,
    });
  }

  refreshToken(secret: string): Observable<RefreshTokenResponse> {
    return this.http
      .post<RefreshTokenResponse>(`${import.meta.env.VITE_API_URL}/auth/refresh`, { secret })
      .pipe(
        tap((response) => {
          const claims = this.decodeToken(response.token);
          this.store.refresh(response.token, claims, response.secret);
        }),
      );
  }

  decodeToken(token: string): Claims {
    const parts = token.split('.');
    if (parts.length === 3) {
      const encodedPayload = parts[1].replace('-', '+').replace('_', '/');
      const data = JSON.parse(window.atob(encodedPayload)) as Claims;

      if (data.exp * 1000 <= Date.now()) {
        throw 'Expired JWT';
      }

      return data;
    }
    throw 'Invalid JWT';
  }
}
