<script setup lang="ts">
import { PropType, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { useMutation } from "@tanstack/vue-query";
import Drawer from "primevue/drawer";
import AppLogo from "@/components/AppLogo.vue";
import { isLogged, removeUser } from "@/store/auth";
import UserProfile from "@/components/UserProfile.vue";
import { useRouter } from "vue-router";
import { logout as logoutApi } from "@/composables/useApi";
import { Link } from "@/composables/useNavigation";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  links: {
    type: Array as PropType<Link[]>,
    default: () => [],
  },
});

const emits = defineEmits({
  "update:visible": (_value: boolean) => true,
  close: () => true,
});

// DATA
const router = useRouter();
const isDesktop = useMediaQuery("(min-width: 768px)");

// MUTATION
const mLogout = useMutation({
  mutationFn: logoutApi,
  onSuccess: () => {
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "home" });
    closeMenu();
  },
  onError: (e) => {
    console.error(e);
  },
});

// HANDLERS
const closeMenu = (): void => {
  emits("update:visible", false);
  emits("close");
};

const logout = (): void => {
  mLogout.mutate();
};

// Chiudi il menu quando passiamo a desktop
watch(isDesktop, (isDesktopValue) => {
  if (isDesktopValue && props.visible) {
    closeMenu();
  }
});
</script>

<template>
  <Drawer
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
        <template v-for="link in links" :key="link.url">
          <a
            :href="link.url"
            class="text-primary-600 hover:text-primary-900 transition-colors text-xl font-medium"
            @click="closeMenu"
            >{{ link.label }}</a
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
  </Drawer>
</template>
