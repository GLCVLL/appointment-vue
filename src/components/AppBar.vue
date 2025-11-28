<script setup lang="ts">
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isLogged, removeUser } from "@/store/auth";
import { useAxios } from "@/composables/useAxios";

// DATA
const router = useRouter();
const axios = useAxios();

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

// API
const logout = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    await axios.delete(apiUrl + "/api/logout");
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "login" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <Menubar :model="items" class="bg-primary-500 border-none rounded-none h-16">
    <template #end>
      <div class="flex gap-2 align-items-center">
        <Button
          v-if="!isLogged()"
          label="Login"
          @click="router.push({ name: 'login' })"
        />
        <Button
          v-if="isLogged()"
          label="Logout"
          severity="secondary"
          @click="logout"
        />
      </div>
    </template>
  </Menubar>
</template>
