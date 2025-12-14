<script setup lang="ts">
import Avatar from "primevue/avatar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { getUser, removeUser } from "@/store/auth";
import { logout as logoutApi } from "@/composables/useApi";
import Dropdown, { type MenuItem } from "@/components/Dropdown.vue";

const props = defineProps({
  showDropdown: {
    type: Boolean,
    default: true,
  },
});

// DATA
const router = useRouter();

const user = computed(() => getUser());
const userInitials = computed(() => {
  return (user.value?.name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

// MUTATION
const mLogout = useMutation({
  mutationFn: logoutApi,
  onSuccess: () => {
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "home" });
  },
  onError: (e) => {
    console.error(e);
  },
});

const menuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: "Logout",
      icon: "logout",
      command: () => mLogout.mutate(),
    },
  ];
});
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
