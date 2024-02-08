<script>
import AppLoader from '../components/AppLoader.vue';
export default {
    name: 'HomePage',
    data() {
        return {
            services: [],
            isLoading: false
        }
    },
    components: {
        AppLoader
    },
    methods: {
        async getUsers() {
            const apiUrl = import.meta.env.VITE_BASEURI;
            try {
                this.isLoading = true;
                const { data } = await this.$axios.get(apiUrl + '/api/services');
                this.services = data.services;
            } catch (e) {
                console.error(e);
            } finally {
                this.isLoading = false;
            }

        }
    },
    mounted() {
        this.getUsers();
    }
}
</script>

<template>
    <div class="container">
        <h1>Home Page</h1>
        <section>
            <h2>Utenti</h2>
            <AppLoader v-if="isLoading" />
            <ul v-else>
                <li v-for="service in services" :key="service.id">
                    <h5>{{ service.name }}</h5>
                </li>
            </ul>
        </section>
    </div>
</template>

<style></style>