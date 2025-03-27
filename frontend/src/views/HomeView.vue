<script setup lang="ts">
import TimerComponent from '@/components/TimerComponent.vue';

function timerStop(time: number) {
  console.log(time);
}
</script>

<template>
  <div class="flex-1 flex flex-col place-content-center">
    <TimerComponent @stop="timerStop" />
  </div>
</template>

<style scoped></style>
