<script setup lang="ts">
import { ref } from "vue";
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";
import Button from "@/components/Button.vue";
import MobileMenu from "@/components/MobileMenu.vue";
import { isLogged } from "@/store/auth";

// STATE
const mobileMenuVisible = ref(false);

// EMITS
const emit = defineEmits({
  menuToggle: () => true,
});

// HANDLERS
const handleMenuToggle = (): void => {
  mobileMenuVisible.value = true;
  emit("menuToggle");
};
</script>

<template>
  <div
    class="border-none rounded-none h-16 flex items-center justify-between px-4"
  >
    <div class="flex items-center gap-4">
      <!-- Logo -->
      <AppLogo />
    </div>
    <div class="flex gap-2 items-center">
      <div class="hidden md:flex gap-12">
        <!-- Nav links -->
        <ul class="hidden md:flex items-center gap-8">
          <li>
            <RouterLink
              to="#"
              class="text-primary-600 hover:text-primary-900 transition-colors uppercase"
              >Servizi</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="#"
              class="text-primary-600 hover:text-primary-900 transition-colors uppercase"
              >Galleria</RouterLink
            >
          </li>
          <li>
            <RouterLink
              v-if="isLogged()"
              to="/appointments"
              class="text-primary-600 hover:text-primary-900 transition-colors uppercase"
              >Prenota</RouterLink
            >
            <RouterLink
              v-else
              to="/login"
              class="text-primary-600 hover:text-primary-900 transition-colors uppercase"
              >Prenota</RouterLink
            >
          </li>
        </ul>

        <div v-if="isLogged()">
          <UserProfile />
        </div>
        <div v-else class="flex gap-4">
          <RouterLink
            to="/login"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Accedi</RouterLink
          >
          <RouterLink
            to="/register"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Registrati</RouterLink
          >
        </div>
      </div>

      <Button
        icon="menu"
        @click="handleMenuToggle"
        variant="text"
        class="md:hidden"
      />
    </div>
  </div>

  <MobileMenu v-model:visible="mobileMenuVisible" />
</template>
