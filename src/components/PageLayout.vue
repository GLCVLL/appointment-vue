<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";
</script>

<template>
  <div class="flex flex-col h-screen bg-primary-50 text-primary-800">
    <AppBar />
    <main class="flex-1 overflow-y-auto p-4 flex flex-col">
      <slot />
    </main>
  </div>
</template>
