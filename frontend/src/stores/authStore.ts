import type { UserResponse } from '@/interfaces/auth';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: (): { isLoggedIn: boolean; user?: UserResponse } => {
    return { isLoggedIn: false };
  },

  actions: {
    login(user: UserResponse) {
      this.isLoggedIn = true;
      this.user = user;
    },

    logout() {
      this.isLoggedIn = false;
      this.user = undefined;
    },
  },
});
