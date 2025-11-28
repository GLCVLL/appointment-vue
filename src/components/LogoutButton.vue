<script lang="ts">
import { defineComponent } from 'vue';
import { isLogged, removeUser } from '@/store/auth';

export default defineComponent({
    name: 'LogoutButton',
    computed: {
        isLogged,
    },
    methods: {
        async logout(): Promise<void> {
            const apiUrl = import.meta.env.VITE_BASEURI as string;
            try {
                await this.$axios.delete(apiUrl + '/api/logout');
                localStorage.removeItem('user');
                removeUser();
                this.$router.push({ name: 'login' });
            } catch (e) {
                console.error(e);
            }
        }
    }
});

</script>

<template>
    <button v-if="isLogged" type="button" class="btn btn-small btn-secondary" @click="logout">Logout</button>
</template>

<style></style>