<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import { useTimerStore } from './stores/timerStore';

const timerStore = useTimerStore();
</script>

<template>
  <div class="w-full h-screen flex flex-col bg-gray-800">
    <HeaderComponent v-if="!timerStore.isRunning" />
    <RouterView />
  </div>
</template>

<style scoped></style>
