<script setup lang="ts">
import InputComponent from '@/components/InputComponent.vue';
import SnackBarComponent from '@/components/SnackBarComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
import type { ApiResponse } from '@/interfaces/response';
import { authServiceKey } from '@/keys';
import type { AuthService } from '@/services/authService';
import { catchError, of } from 'rxjs';
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const authService = inject<AuthService>(authServiceKey);
const router = useRouter();
const message = ref('');
const showMessage = ref(false);

const email = ref('');
const password = ref('');
const loading = ref(false);
let timeoutHandle: number;

function closeSnackBar() {
  showMessage.value = false;
  if (timeoutHandle !== undefined) {
    clearTimeout(timeoutHandle);
  }
}

function submitClick() {
  loading.value = true;
  authService
    ?.login(email.value, password.value)
    .pipe(
      catchError((err) => {
        console.error(err);
        err.json().then((err: ApiResponse<null>) => {
          message.value = `Error: ${err?.err || 'An unknown error occurred'}`;
          showMessage.value = true;
          timeoutHandle = setTimeout(() => (showMessage.value = false), 5000);
        });
        return of(null);
      }),
    )
    .subscribe((response) => {
      loading.value = false;
      console.log(response);
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
      <InputComponent placeholder="Email" autocomplete="email" v-model="email" />
      <InputComponent
        placeholder="Password"
        autocomplete="current-password"
        v-model="password"
        type="password"
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

  <SnackBarComponent :message="message" :show="showMessage" @close="closeSnackBar" />
</template>

<style scoped></style>
