<script setup lang="ts">
import SnackBarComponent from '@/components/SnackBarComponent.vue';
import SpinnerComponent from '@/components/SpinnerComponent.vue';
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
      class="text-center bg-gray-700 rounded-lg flex flex-col place-content-center shadow-xl place-items-center p-5 space-y-5"
    >
      <input
        class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white"
        autocomplete="username"
        placeholder="Username"
        v-model="username"
      />
      <input
        class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white"
        autocomplete="email"
        placeholder="Email"
        v-model="email"
      />
      <input
        class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white"
        placeholder="Password"
        autocomplete="new-password"
        type="password"
        v-model="password"
      />
      <input
        class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white"
        placeholder="Confirm Password"
        autocomplete="new-password"
        type="password"
        v-model="confirm"
      />
      <button
        class="text-white rounded-md bg-blue-500 w-20 px-3 py-2 shadow-md hover:brightness-85 active:brightness-110 inline-flex w-fit items-center align-center"
        @click="submitClick"
      >
        <SpinnerComponent v-if="loading" />
        Register
      </button>
    </div>
  </div>

  <SnackBarComponent :message="message" :show="showMessage" @close="closeSnackBar" />
</template>
