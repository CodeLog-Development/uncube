import type { UserResponse } from '@/interfaces/auth';
import type { ApiResponse } from '@/interfaces/response';
import { tap, type Observable } from 'rxjs';
import { useHttp } from './httpService';
import { useAuthStore } from '@/stores/authStore';

export class AuthService {
  private http = useHttp();
  private store;

  constructor() {
    this.store = useAuthStore();
  }

  login(email: string, password: string): Observable<ApiResponse<UserResponse>> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${import.meta.env.VITE_API_URL}/auth`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response?.ok) {
            this.store.login(response.ok);
          }
        }),
      );
  }

  register(
    username: string,
    email: string,
    password: string,
  ): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${import.meta.env.VITE_API_URL}/user`, {
      username,
      email,
      password,
    });
  }
}
