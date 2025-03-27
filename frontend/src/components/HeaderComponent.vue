<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const emit = defineEmits(['logout']);

const router = useRouter();
const store = useAuthStore();

function logoutClick() {
  store.logout();
  emit('logout');
}

const navItems: { path: string; name: string }[] = [];
const noUserNavItems: { path: string; name: string }[] = [
  {
    name: 'Login',
    path: '/login',
  },
  {
    name: 'Register',
    path: '/register',
  },
];
</script>

<template>
  <div class="w-full h-13 m-0 bg-blue-500 flex px-3 flex-row">
    <button
      @click="router.push('/')"
      class="w-fit h-fit text-white p-1 rounded-md hover:backdrop-brightness-110 active:backdrop-brightness-85 self-center"
    >
      Uncube
    </button>

    <div class="self-center flex-1 place-content-end flex flex-row space-x-3">
      <button
        class="w-fit text-white p-1 rounded-md hover:backdrop-brightness-110 active:backdrop-brightness-85"
        v-for="item in navItems"
        :key="item.name"
        @click="router.push(item.path)"
      >
        {{ item.name }}
      </button>

      <div v-if="!store.isLoggedIn" class="space-x-3">
        <button
          class="w-fit text-white p-1 rounded-md hover:backdrop-brightness-110 active:backdrop-brightness-85"
          v-for="item in noUserNavItems"
          :key="item.name"
          @click="router.push(item.path)"
        >
          {{ item.name }}
        </button>
      </div>
      <div v-if="store.isLoggedIn" class="space-x-3">
        <button
          class="w-fit text-white p-1 rounded-md hover:backdrop-brightness-110 active:backdrop-brightness-85"
          @click="logoutClick"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
