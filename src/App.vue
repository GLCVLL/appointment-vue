<script>
import { default as auth, isLogged } from './store/auth';
import LogoutButton from './components/LogoutButton.vue';
export default {
  name: 'App',
  components: { LogoutButton },
  computed: {
    auth,
    isLogged,
  },
}

</script>

<template>
  <header class="bg-dark p-3">
    <nav class="d-flex align-items-center justify-content-between">
      <router-link :to="{ name: 'home' }" class="btn btn-secondary">Home</router-link>
      <router-link :to="{ name: 'appointments' }">Appointments</router-link>
      <router-link v-if="!isLogged" :to="{ name: 'login' }" class="btn btn-secondary">Login</router-link>
      <LogoutButton />
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss">
@use "./scss/main";
</style>
