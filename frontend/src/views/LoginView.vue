<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');

function submitClick() {
  console.log('Username: ', username.value);
  console.log('Password: ', password.value);
}
</script>

<template>
  <div class="w-full h-full flex flex-row place-items-center justify-center">
    <div
      class="text-center bg-gray-500 rounded-lg flex flex-col place-content-center shadow-xl place-items-center p-10 space-y-5"
    >
      <input
        class="ring-green-300 ring-2 text-center rounded-md p-2 text-white"
        placeholder="Username"
        v-model="username"
      />
      <input
        class="ring-green-300 ring-2 text-center rounded-md p-2 text-white"
        placeholder="Password"
        type="password"
        v-model="password"
      />
      <button
        class="text-white rounded-md bg-gray-600 w-20 p-2 shadow-md hover:brightness-85 active:brightness-110"
        @click="submitClick"
      >
        Login
      </button>
    </div>
  </div>
</template>

<style scoped></style>
