<script setup lang="ts">
import Avatar from "primevue/avatar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getUser, removeUser } from "@/store/auth";
import { useAxios } from "@/composables/useAxios";
import Dropdown, { type MenuItem } from "@/components/Dropdown.vue";

const router = useRouter();
const axios = useAxios();

const user = computed(() => getUser());
const userInitials = computed(() => {
  return (user.value?.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const menuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: "Logout",
      icon: "logout",
      command: logout,
    },
  ];
});

const logout = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    await axios.delete(apiUrl + "/api/logout");
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "home" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="flex items-center">
    <Dropdown :items="menuItems">
      <Avatar
        v-if="user"
        :label="userInitials"
        shape="circle"
        size="large"
        class="cursor-pointer"
      />
    </Dropdown>
  </div>
</template>
