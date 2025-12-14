<script setup lang="ts">
import { isLogged, removeUser } from "@/store/auth";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { logout as logoutApi } from "@/composables/useApi";

const router = useRouter();

const mLogout = useMutation({
  mutationFn: logoutApi,
  onSuccess: () => {
    localStorage.removeItem("user");
    removeUser();
    router.push({ name: "login" });
  },
  onError: (e) => {
    console.error(e);
  },
});

const logout = (): void => {
  mLogout.mutate();
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
