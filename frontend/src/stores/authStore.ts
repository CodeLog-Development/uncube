import type { AuthResponse, UserResponse } from '@/interfaces/auth';
import { defineStore } from 'pinia';

interface TokenPayload {
  user_id: number;
  exp: number;
}

export const useAuthStore = defineStore('auth', {
  state: (): { isLoggedIn: boolean; user?: UserResponse; token?: string } => {
    const token = localStorage.getItem('token');

    if (token !== null) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const encodedPayload = parts[1].replace('-', '+').replace('_', '/');
        const payload = JSON.parse(window.atob(encodedPayload)) as TokenPayload;
        if (payload.exp * 1000 > Date.now()) {
          return { isLoggedIn: true, token };
        }
      }
    }

    return { isLoggedIn: false };
  },

  actions: {
    login(res: AuthResponse) {
      this.isLoggedIn = true;
      this.user = res.user;
      this.token = res.token;
      localStorage.setItem('token', res.token);
    },

    logout() {
      this.isLoggedIn = false;
      this.user = undefined;
      this.token = undefined;
      localStorage.removeItem('token');
    },
  },
});
