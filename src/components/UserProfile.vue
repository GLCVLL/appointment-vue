<script setup lang="ts">
import Avatar from "primevue/avatar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getUser, removeUser } from "@/store/auth";
import { useApi } from "@/composables/useApi";
import Dropdown, { type MenuItem } from "@/components/Dropdown.vue";

const props = defineProps({
  showDropdown: {
    type: Boolean,
    default: true,
  },
});

// DATA
const router = useRouter();
const axios = useApi();

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

// HANDLERS
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
    <Dropdown v-if="showDropdown" :items="menuItems">
      <Avatar
        :label="userInitials"
        shape="circle"
        size="normal"
        class="cursor-pointer bg-primary-700 text-white"
      />
    </Dropdown>
    <Avatar
      v-else
      :label="userInitials"
      shape="circle"
      size="normal"
      class="cursor-pointer bg-primary-700 text-white"
    />
  </div>
</template>
