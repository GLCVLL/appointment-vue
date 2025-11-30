<script setup lang="ts">
import PrimeCard from "primevue/card";

// PROPS
const props = defineProps({
  title: {
    type: String,
  },
});
</script>

<template>
  <PrimeCard class="bg-primary-200 text-primary-800">
    <template v-if="title" #title>
      {{ title }}
    </template>
    <template #content>
      <slot />
    </template>
  </PrimeCard>
</template>
