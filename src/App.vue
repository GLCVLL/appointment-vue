<script lang="ts">
import { defineComponent } from 'vue';
import { default as auth, isLogged } from '@/store/auth';
import LogoutButton from '@/components/LogoutButton.vue';

export default defineComponent({
  name: 'App',
  components: { LogoutButton },
  computed: {
    auth,
    isLogged,
  },
});

</script>

<template>
  <header class="bg-dark p-3">
    <nav class="d-flex align-items-center justify-content-between">
      <router-link :to="{ name: 'home' }" class="btn btn-secondary">Home</router-link>
      <div class="d-flex gap-2 align-items-center">
        <router-link v-if="isLogged" :to="{ name: 'appointments' }">Appointments</router-link>
        <router-link v-if="!isLogged" :to="{ name: 'login' }" class="btn btn-secondary">Login</router-link>
        <LogoutButton />
      </div>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@use "./scss/main";

a {
  color: white;
}
</style>
