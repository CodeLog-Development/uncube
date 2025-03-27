<script setup lang="ts">
import { useTimerStore } from '@/stores/timerStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['stop', 'start']);
const timerStore = useTimerStore();

const elapsed = ref(0);

const millis = computed(() => {
  if (timerStore.isRunning) {
    return Math.floor((elapsed.value % 1000) / 100)
      .toString()
      .padStart(1, '0');
  } else {
    return (elapsed.value % 1000).toString().padStart(3, '0');
  }
});
const seconds = computed(() => {
  if (elapsed.value > 60000) {
    return (Math.floor(elapsed.value / 1000) % 60).toString().padStart(2, '0');
  } else {
    return (Math.floor(elapsed.value / 1000) % 60).toString().padStart(1, '0');
  }
});
const minutes = computed(() =>
  Math.floor(elapsed.value / 60000)
    .toString()
    .padStart(1, '0'),
);

const abortController = new AbortController();
const timerReady = ref(false);
const stopped = ref(false);
let stopFired = false;
const down = ref(false);
let downTimer: number | null = null;
onMounted(() => {
  document.addEventListener(
    'keydown',
    (ev) => {
      if (ev.key === ' ' && !timerStore.isRunning && !down.value) {
        timerReady.value = false;
        downTimer = setTimeout(() => {
          timerReady.value = true;
          downTimer = null;
        }, 300);
      } else if (ev.key === ' ' && timerStore.isRunning) {
        timerStop();
      }

      if (ev.key === ' ') {
        down.value = true;
      }
    },
    { signal: abortController.signal },
  );

  document.addEventListener(
    'keyup',
    (ev) => {
      if (ev.key === ' ') {
        down.value = false;
        if (downTimer !== null) {
          clearTimeout(downTimer);
          downTimer = null;
          return;
        }

        if (!timerStore.isRunning && !stopFired) {
          timerStart();
        }

        stopFired = false;
      }
    },
    { signal: abortController.signal },
  );
});

let interval: number;
let startTime: number;

function timerStart() {
  timerStore.start();
  emit('start');
  startTime = Date.now();
  timerReady.value = false;
  stopped.value = false;

  interval = setInterval(() => {
    elapsed.value = Date.now() - startTime;
  }, 1);
}

function timerStop() {
  clearInterval(interval);
  elapsed.value = Date.now() - startTime;
  timerStore.stop();
  stopped.value = true;
  stopFired = true;
  emit('stop', elapsed.value);
}

onUnmounted(() => {
  console.log('Unmount');
  abortController.abort();
});
</script>

<template>
  <div class="text-white text-center">
    <p
      v-if="elapsed <= 60000"
      class="font-mono timer-par"
      :class="{
        ready: timerReady,
        down: down && !timerReady,
      }"
    >
      {{ seconds }}.{{ millis }}
    </p>
    <p
      v-if="elapsed > 60000"
      class="font-mono timer-par"
      :class="{
        ready: timerReady,
        down: down && !timerReady,
      }"
    >
      {{ minutes }}:{{ seconds }}.{{ millis }}
    </p>
  </div>
</template>

<style scoped>
.timer-par {
  font-size: 96px;
}

.timer-par.ready {
  color: green;
}

.timer-par.down {
  color: red;
}
</style>
