<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
</script>

<template>
  <div class="w-full h-screen flex flex-col bg-gray-800">
    <HeaderComponent />
    <RouterView />
  </div>
</template>

<style scoped></style>
