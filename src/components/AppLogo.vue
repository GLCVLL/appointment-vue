<script setup lang="ts">
import { RouterLink } from "vue-router";

// DATA
const appName = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <RouterLink to="/" class="text-primary-500 font-bold text-2xl no-underline">
    {{ appName }}
  </RouterLink>
</template>
