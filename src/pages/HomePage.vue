<script lang="ts">
import { defineComponent } from 'vue';
import AppLoader from '@/components/AppLoader.vue';

interface Service {
    id: number;
    name: string;
    [key: string]: unknown;
}

export default defineComponent({
    name: 'HomePage',
    data() {
        return {
            services: [] as Service[],
            isLoading: false
        };
    },
    components: {
        AppLoader
    },
    methods: {
        async getUsers(): Promise<void> {
            const apiUrl = import.meta.env.VITE_BASEURI as string;
            try {
                this.isLoading = true;
                const { data } = await this.$axios.get<{ services: Service[] }>(apiUrl + '/api/services');
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
});
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