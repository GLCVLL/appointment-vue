<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";

// HANDLERS
const handleMenuToggle = () => {
  console.log("menuToggle");
};
</script>

<template>
  <div class="flex flex-col h-screen bg-primary-50 text-primary-800">
    <AppBar @menuToggle="handleMenuToggle" />
    <main class="flex-1 overflow-y-auto p-4 flex flex-col">
      <slot />
    </main>
  </div>
</template>
