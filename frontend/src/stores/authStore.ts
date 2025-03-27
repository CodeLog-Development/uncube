import type { AuthResponse, Claims, UserResponse } from '@/interfaces/auth';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: (): {
    isLoggedIn: boolean;
    user?: UserResponse;
    token?: string;
    refreshToken?: string;
  } => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken != null) {
      return { isLoggedIn: false, refreshToken };
    } else {
      return { isLoggedIn: false };
    }
  },

  actions: {
    login(res: AuthResponse) {
      this.isLoggedIn = true;
      this.user = res.user;
      this.token = res.token;
      this.refreshToken = res.refreshToken;
      localStorage.setItem('refreshToken', res.refreshToken);
    },

    refresh(token: string, claims: Claims, secret: string) {
      this.isLoggedIn = true;
      this.user = {
        id: claims.user_id,
        username: claims.username,
        email: claims.email,
      };
      this.token = token;
      this.refreshToken = secret;
      localStorage.setItem('refreshToken', secret);
    },

    logout() {
      this.isLoggedIn = false;
      this.user = undefined;
      this.token = undefined;
      localStorage.removeItem('refreshToken');
    },
  },
});
