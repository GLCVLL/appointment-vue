<script setup lang="ts">
import { watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import Sidebar from "primevue/sidebar";
import AppLogo from "@/components/AppLogo.vue";
import { isLogged } from "@/store/auth";

// PROPS
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

// EMITS
const emits = defineEmits({
  "update:visible": (_value: boolean) => true,
  close: () => true,
});

// MEDIA QUERY - md breakpoint di Tailwind è 768px
const isDesktop = useMediaQuery("(min-width: 768px)");

// HANDLERS
const closeMenu = (): void => {
  emits("update:visible", false);
  emits("close");
};

// Chiudi il menu quando passiamo a desktop
watch(isDesktop, (isDesktopValue) => {
  if (isDesktopValue && props.visible) {
    closeMenu();
  }
});
</script>

<template>
  <Sidebar
    :visible="visible"
    position="full"
    class="w-full bg-white text-primary-500"
    @update:visible="$emit('update:visible', $event)"
    @hide="closeMenu"
  >
    <template #header>
      <AppLogo />
    </template>

    <nav class="flex flex-col gap-6">
      <RouterLink
        to="/"
        class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
        @click="closeMenu"
        >Home</RouterLink
      >

      <RouterLink
        v-if="isLogged()"
        to="/appointments"
        class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
        @click="closeMenu"
        >Prenota</RouterLink
      >
      <RouterLink
        v-else
        to="/login"
        class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
        @click="closeMenu"
        >Prenota</RouterLink
      >
      <RouterLink
        to="/login"
        class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
        @click="closeMenu"
        >Accedi</RouterLink
      >
      <RouterLink
        to="/register"
        class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
        @click="closeMenu"
        >Registrati</RouterLink
      >
    </nav>
  </Sidebar>
</template>
