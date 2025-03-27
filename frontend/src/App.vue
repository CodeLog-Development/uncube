<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import { useTimerStore } from './stores/timerStore';
import { useAuthStore } from './stores/authStore';
import { authServiceKey } from './keys';
import { inject } from 'vue';
import type { AuthService } from './services/authService';
import { catchError, of } from 'rxjs';
import SnackBarComponent from './components/SnackBarComponent.vue';
import { useSnackBar } from './services/snackBar';

const timerStore = useTimerStore();
const authStore = useAuthStore();

const authService = inject<AuthService>(authServiceKey)!;
const { open, openSubject } = useSnackBar();

if (!authStore.isLoggedIn && authStore.refreshToken) {
  authService
    .refreshToken(authStore.refreshToken)
    .pipe(
      catchError((err) => {
        console.error('Failed to refresh auth token: ', err);
        return of(null);
      }),
    )
    .subscribe((res) => {
      if (res) {
        console.log('Logged in');
      }
    });
}

function logout() {
  open('Successfully logged out!', {
    duration: 5000,
  });
}
</script>

<template>
  <div class="w-full h-screen flex flex-col bg-gray-800">
    <HeaderComponent v-if="!timerStore.isRunning" @logout="logout" />
    <RouterView />
  </div>

  <SnackBarComponent :openSubject />
</template>

<style scoped></style>
