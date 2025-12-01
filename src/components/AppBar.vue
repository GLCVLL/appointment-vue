<script setup lang="ts">
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";
import Button from "@/components/Button.vue";

// EMITS
const emit = defineEmits({
  menuToggle: () => true,
});

// HANDLERS
const handleMenuToggle = (): void => {
  emit("menuToggle");
};
</script>

<template>
  <div
    class="bg-primary-200 text-primary-800 border-none rounded-none h-16 flex items-center justify-between px-4"
  >
    <div class="flex items-center gap-4">
      <Button icon="menu" @click="handleMenuToggle" class="md:hidden" />
      <AppLogo />
    </div>
    <div class="flex gap-2 align-items-center">
      <UserProfile />
    </div>
  </div>
</template>
