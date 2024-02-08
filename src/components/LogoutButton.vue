<script>
import { isLogged, removeUser } from '../store/auth';
export default {
    name: 'LogoutButton',
    computed: {
        isLogged,
    },
    methods: {
        async logout() {
            const apiUrl = import.meta.env.VITE_BASEURI;
            try {
                await this.$axios.delete(apiUrl + '/api/logout');
                localStorage.removeItem('user');
                removeUser();
                this.$router.push('login');
            } catch (e) {
                console.error(e);
            }
        }
    }
};

</script>

<template>
    <button v-if="isLogged" type="button" class="btn btn-small btn-secondary" @click="logout">Logout</button>
</template>

<style></style>