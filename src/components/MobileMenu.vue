<script setup lang="ts">
import { watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import Sidebar from "primevue/sidebar";
import AppLogo from "@/components/AppLogo.vue";
import { isLogged, removeUser } from "@/store/auth";
import UserProfile from "@/components/UserProfile.vue";
import { useRouter } from "vue-router";
import { useAxios } from "@/composables/useAxios";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits({
  "update:visible": (_value: boolean) => true,
  close: () => true,
});

// DATA
const router = useRouter();
const axios = useAxios();
const isDesktop = useMediaQuery("(min-width: 768px)");

// HANDLERS
const closeMenu = (): void => {
  emits("update:visible", false);
  emits("close");
};

const logout = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    await axios.delete(apiUrl + "/api/logout");
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "home" });
    closeMenu();
  } catch (e) {
    console.error(e);
  }
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
      <UserProfile v-if="isLogged()" :showDropdown="false" />
      <AppLogo v-else />
    </template>

    <nav class="flex flex-col gap-12">
      <div class="flex flex-col gap-6">
        <RouterLink
          to="/"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="closeMenu"
          >Home</RouterLink
        >
        <RouterLink
          to="#"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="closeMenu"
          >Servizi</RouterLink
        >
        <RouterLink
          to="#"
          class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
          @click="closeMenu"
          >Galleria</RouterLink
        >

        <template v-if="isLogged()">
          <RouterLink
            to="/appointments"
            class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
            @click="closeMenu"
            >Prenota</RouterLink
          >
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
            @click="closeMenu"
            >Prenota</RouterLink
          >
        </template>
      </div>

      <div class="flex flex-col gap-6">
        <template v-if="isLogged()">
          <RouterLink
            to="#"
            class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
            @click="logout"
            >Logout</RouterLink
          >
        </template>

        <template v-else>
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
        </template>
      </div>
    </nav>
  </Sidebar>
</template>
