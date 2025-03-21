<script setup lang="ts">
const props = defineProps({
  placeholder: String,
  autocomplete: String,
  type: String,
});

const model = defineModel<string>();
</script>

<template>
  <input
    class="ring-blue-500 ring-2 text-center rounded-md p-2 text-white"
    :placeholder="props.placeholder"
    :autocomplete="props.autocomplete"
    :type="props.type"
    v-model="model"
  />
</template>

<style scoped></style>
