<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";
</script>

<template>
  <div class="flex flex-col h-screen">
    <AppBar />
    <main class="flex-1 overflow-y-auto p-4">
      <slot />
    </main>
  </div>
</template>
