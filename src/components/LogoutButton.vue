<script setup lang="ts">
import { isLogged, removeUser } from "@/store/auth";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/useApi";

const router = useRouter();
const axios = useApi();

const logout = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    await axios.get(apiUrl + "/sanctum/csrf-cookie");
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
  <button
    v-if="isLogged()"
    type="button"
    class="btn btn-small btn-secondary"
    @click="logout"
  >
    Logout
  </button>
</template>

<style></style>
