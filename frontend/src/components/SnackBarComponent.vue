<script setup lang="ts">
import type { SnackBarOpen } from '@/interfaces/snackBar';
import { Subscription, type Subject } from 'rxjs';
import { onMounted, onUnmounted, ref } from 'vue';

const { openSubject } = defineProps<{ openSubject: Subject<SnackBarOpen> }>();
const emit = defineEmits(['close']);

const message = ref('');
const show = ref(false);

let handle: number | undefined = undefined;
let sub: Subscription | undefined = undefined;

onMounted(() => {
  sub = openSubject.subscribe((ev) => {
    clearTimeout(handle);

    message.value = ev.message;
    show.value = true;

    if (ev.duration) {
      handle = setTimeout(() => {
        show.value = false;
      }, ev.duration);
    }
  });
});

function close() {
  emit('close');
  clearTimeout(handle);
  show.value = false;
}

onUnmounted(() => {
  sub?.unsubscribe();
});
</script>

<template>
  <div class="absolute bottom-0 w-full flex place-content-center py-2" v-if="show">
    <div
      class="w-fit rounded-md bg-blue-600 opacity-75 pl-3 space-x-2 shadow-lg text-white flex flex-row place-content-center align-center mx-2"
    >
      <span class="overflow-wrap h-full content-center">{{ message }}</span>
      <button
        class="bg-white text-black rounded-md p-1 m-1 hover:brightness-85 active:brightness-110"
        @click="close"
      >
        Close
      </button>
    </div>
  </div>
</template>

<style scoped>
button,
span {
  font-size: 14px;
}
</style>
