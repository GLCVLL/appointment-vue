<script setup lang="ts">
import Menubar from "primevue/menubar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isLogged } from "@/store/auth";
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";

// DATA
const router = useRouter();

const items = computed(() => {
  const menuItems = [
    {
      label: "Home",
      command: () => {
        router.push({ name: "home" });
      },
    },
  ];

  if (isLogged()) {
    menuItems.push({
      label: "Appointments",
      command: () => {
        router.push({ name: "appointments" });
      },
    });
  }

  return menuItems;
});
</script>

<template>
  <Menubar
    :model="items"
    class="bg-primary-200 text-primary-800 border-none rounded-none h-16"
  >
    <template #start>
      <AppLogo />
    </template>
    <template #end>
      <div class="flex gap-2 align-items-center">
        <UserProfile />
      </div>
    </template>
  </Menubar>
</template>
