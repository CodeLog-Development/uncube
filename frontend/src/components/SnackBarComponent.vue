<script setup lang="ts">
const { message, show } = defineProps<{ message: string; show: boolean }>();
defineEmits(['close']);
</script>

<template>
  <div class="absolute bottom-0 w-full flex place-content-center py-2" v-if="show">
    <div class="w-fit rounded-md bg-blue-600 opacity-75 pl-3 space-x-2 shadow-lg text-white">
      <span>{{ message }}</span>
      <button class="bg-white text-black rounded-md p-1 m-1 hover:brightness-85 active:brightness-110"
        @click="$emit('close')">
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
