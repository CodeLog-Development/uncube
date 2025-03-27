<script setup lang="ts">
import InputComponent from '@/components/InputComponent.vue';
import SnackBarComponent from '@/components/SnackBarComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import type { ApiError } from '@/interfaces/response';
import { authServiceKey } from '@/keys';
import type { AuthService } from '@/services/authService';
import { useSnackBar } from '@/services/snackBar';
import { catchError, of } from 'rxjs';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const authService = inject<AuthService>(authServiceKey);
const router = useRouter();
const { openSubject, open } = useSnackBar();

const email = ref('');
const password = ref('');
const loading = ref(false);

function submitClick() {
  loading.value = true;
  authService
    ?.login(email.value, password.value)
    .pipe(
      catchError((err) => {
        err.json().then((err: ApiError) => {
          console.log(err);
          open(`Error: ${err.error}`, {
            duration: 5000,
          });
        });
        return of(null);
      }),
    )
    .subscribe((response) => {
      loading.value = false;
      if (response !== null) {
        router.push('/');
      }
    });
}
</script>

<template>
  <div class="flex-1 self-center flex flex-row place-items-center justify-center">
    <div
      class="text-center bg-gray-700 rounded-lg flex flex-col place-content-center shadow-xl place-items-center p-5 space-y-5"
    >
      <InputComponent
        placeholder="Email"
        autocomplete="email"
        v-model="email"
        @submit="submitClick"
      />
      <InputComponent
        placeholder="Password"
        autocomplete="current-password"
        v-model="password"
        type="password"
        @submit="submitClick"
      />
      <button
        class="text-white rounded-md bg-blue-500 w-20 px-3 py-2 shadow-md hover:brightness-85 active:brightness-110 inline-flex w-fit items-center align-center"
        @click="submitClick"
      >
        <SpinnerComponent v-if="loading" />
        Login
      </button>
    </div>
  </div>

  <SnackBarComponent :openSubject />
</template>

<style scoped></style>
