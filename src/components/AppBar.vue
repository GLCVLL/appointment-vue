<script setup lang="ts">
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { isLogged } from "@/store/auth";

const router = useRouter();

// EMITS
const emit = defineEmits({
  menuToggle: () => true,
});

// HANDLERS
const handleMenuToggle = (): void => {
  emit("menuToggle");
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
    class="bg-primary-200 text-primary-800 border-none rounded-none h-16 flex items-center justify-between px-4"
  >
    <div class="flex items-center gap-4">
      <Button icon="menu" @click="handleMenuToggle" class="md:hidden" />
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
      <div v-else class="flex gap-2">
        <Button label="Accedi" theme="primary" @click="goToLogin" />
        <Button label="Registrati" theme="secondary" @click="goToRegister" />
      </div>
    </div>
  </div>
</template>
