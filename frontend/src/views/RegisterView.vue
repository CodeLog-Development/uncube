<script setup lang="ts">
import SnackBarComponent from '@/components/SnackBarComponent.vue';
import { authServiceKey } from '@/keys';
import router from '@/router';
import { AuthService } from '@/services/authService';
import { inject, ref } from 'vue';

const authService = inject<AuthService>(authServiceKey);

const message = ref('');
const showMessage = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');
const loading = ref(false);

let timeoutId: number | undefined;

function closeSnackBar() {
  showMessage.value = false;
  if (timeoutId !== undefined) {
    clearTimeout(timeoutId);
  }
}

function snackBar(msg: string, timeout?: number) {
  closeSnackBar();
  message.value = msg;
  showMessage.value = true;
  if (timeout) {
    timeoutId = setTimeout(() => (showMessage.value = false), timeout);
  }
}

function submitClick() {
  if (username.value.length === 0) {
    snackBar('Username is required', 2000);
    return;
  }

  if (email.value.length === 0) {
    snackBar('Email is required', 2000);
    return;
  }

  if (password.value.length === 0) {
    snackBar('Password is required', 2000);
    return;
  }

  if (password.value !== confirm.value) {
    snackBar('Passwords do not match', 2000);
    return;
  }

  loading.value = true;

  authService?.register(username.value, email.value, password.value).subscribe((response) => {
    loading.value = false;
    if (response?.ok !== undefined) {
      snackBar('Succesfully registered');
      setTimeout(() => router.push('/login'), 3000);
    }
  });
}
</script>

<template>
  <div class="flex-1 self-center flex flex-row place-items-center justify-center">
    <div
      class="text-center bg-gray-700 rounded-lg flex flex-col place-content-center shadow-xl place-items-center p-5 space-y-5">
      <input class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white" autocomplete="username"
        placeholder="Username" v-model="username" />
      <input class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white" autocomplete="email" placeholder="Email"
        v-model="email" />
      <input class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white" placeholder="Password"
        autocomplete="new-password" type="password" v-model="password" />
      <input class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white" placeholder="Confirm Password"
        autocomplete="new-password" type="password" v-model="confirm" />
      <button
        class="text-white rounded-md bg-blue-500 w-20 px-3 py-2 shadow-md hover:brightness-85 active:brightness-110 inline-flex w-fit items-center align-center"
        @click="submitClick">
        <svg v-if="loading" role="status" class="w-4 h-4 me-3 text-white animate-spin self-center" viewBox="0 0 100 101"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB" />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor" />
        </svg>
        Register
      </button>
    </div>
  </div>

  <SnackBarComponent :message="message" :show="showMessage" @close="closeSnackBar" />
</template>
