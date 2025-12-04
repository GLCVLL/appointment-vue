<script setup lang="ts">
import { useRouter } from "vue-router";
import Sidebar from "primevue/sidebar";
import AppLogo from "@/components/AppLogo.vue";
import { isLogged } from "@/store/auth";

const router = useRouter();

// PROPS
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

// EMITS
const emits = defineEmits({
  "update:visible": (value: boolean) => true,
  close: () => true,
});

// HANDLERS
const closeMenu = (): void => {
  emits("update:visible", false);
  emits("close");
};

const goToAppointments = (): void => {
  router.push({ name: "appointments" });
  closeMenu();
};

const goToLogin = (): void => {
  router.push({ name: "login" });
  closeMenu();
};

const goToRegister = (): void => {
  router.push({ name: "register" });
  closeMenu();
};
</script>

<template>
  <Sidebar
    :visible="visible"
    position="full"
    class="w-full bg-white text-primary-500"
    @update:visible="$emit('update:visible', $event)"
    @hide="closeMenu"
  >
    <div class="flex flex-col h-full">
      <div class="mb-12">
        <AppLogo />
      </div>
      <nav class="flex flex-col gap-6">
        <RouterLink
          v-if="isLogged()"
          to="/appointments"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="goToAppointments"
          >Prenota</RouterLink
        >
        <RouterLink
          v-else
          to="/login"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="goToLogin"
          >Prenota</RouterLink
        >
        <RouterLink
          to="/login"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="goToLogin"
          >Accedi</RouterLink
        >
        <RouterLink
          to="/register"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="goToRegister"
          >Registrati</RouterLink
        >
      </nav>
    </div>
  </Sidebar>
</template>
