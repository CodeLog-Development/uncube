<script setup lang="ts">
import { useTimerStore } from '@/stores/timerStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['stop', 'start']);
const timerStore = useTimerStore();

const elapsed = ref(0);

const millis = computed(() => (elapsed.value % 1000).toString().padStart(3, '0'));
const seconds = computed(() =>
  Math.floor(elapsed.value / 1000)
    .toString()
    .padStart(2, '0'),
);
const minutes = computed(() =>
  Math.floor(elapsed.value / 60000)
    .toString()
    .padStart(2, '0'),
);

const abortController = new AbortController();
const timerReady = ref(false);
let downTimer: number | null = null;
onMounted(() => {
  document.addEventListener(
    'keydown',
    (ev) => {
      if (ev.key === ' ') {
        downTimer = setTimeout(() => {
          timerReady.value = true;
          downTimer = null;
          timerStore.start();
          emit('start');
        }, 1000);
      }
    },
    { signal: abortController.signal },
  );

  document.addEventListener('keyup', (ev) => {
    if (ev.key === ' ' && downTimer !== null) {
      clearTimeout(downTimer);
      downTimer = null;
    }
  });
});

onUnmounted(() => {
  console.log('Unmount');
  abortController.abort();
});
</script>

<template>
  <div class="text-white text-center">
    <p class="font-mono timer-par">{{ minutes }}:{{ seconds }}:{{ millis }}</p>
  </div>
</template>

<style scoped>
.timer-par {
  font-size: 72px;
}
</style>
