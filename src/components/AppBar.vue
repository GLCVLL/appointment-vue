<script setup lang="ts">
import { ref } from "vue";
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";
import Button from "@/components/Button.vue";
import MobileMenu from "@/components/MobileMenu.vue";
import { RouterLink, useRouter } from "vue-router";
import { isLogged } from "@/store/auth";

const router = useRouter();

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

const closeMobileMenu = (): void => {
  mobileMenuVisible.value = false;
};

const goToLogin = (): void => {
  router.push({ name: "login" });
};

const goToRegister = (): void => {
  router.push({ name: "register" });
};
</script>

<template>
  <div
    class="border-none rounded-none h-16 flex items-center justify-between px-4"
  >
    <div class="flex items-center gap-4">
      <AppLogo />
      <ul class="hidden md:flex items-center gap-4">
        <li>
          <RouterLink
            v-if="isLogged()"
            to="/appointments"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Prenota</RouterLink
          >
          <RouterLink
            v-else
            to="/login"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Prenota</RouterLink
          >
        </li>
      </ul>
    </div>
    <div class="flex gap-2 items-center">
      <div v-if="isLogged()">
        <UserProfile />
      </div>
      <div v-else class="hidden md:flex gap-2">
        <Button label="Accedi" theme="primary" @click="goToLogin" />
        <Button label="Registrati" theme="secondary" @click="goToRegister" />
      </div>
      <Button icon="menu" @click="handleMenuToggle" class="md:hidden" />
    </div>
  </div>
  <MobileMenu v-model:visible="mobileMenuVisible" @close="closeMobileMenu" />
</template>
