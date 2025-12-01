<script setup lang="ts">
import Avatar from "primevue/avatar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isLogged, getUser, removeUser } from "@/store/auth";
import { useAxios } from "@/composables/useAxios";
import Icon from "@/components/Icon.vue";
import Dropdown, { type MenuItem } from "@/components/Dropdown.vue";

// DATA
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
  if (isLogged()) {
    return [
      {
        label: "Logout",
        icon: "logout",
        command: logout,
      },
    ];
  } else {
    return [
      {
        label: "Login",
        icon: "login",
        command: goToLogin,
      },
    ];
  }
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

// HANDLERS
const goToLogin = (): void => {
  router.push({ name: "login" });
};
</script>

<template>
  <div class="flex align-items-center">
    <Dropdown :items="menuItems">
      <Avatar
        v-if="isLogged() && user"
        :label="userInitials"
        shape="circle"
        size="large"
        class="cursor-pointer text-sm"
      />

      <Avatar v-else shape="circle" class="cursor-pointer" size="large">
        <template #icon>
          <Icon name="user" />
        </template>
      </Avatar>
    </Dropdown>
  </div>
</template>
