<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";

interface Service {
  id: number;
  name: string;
  [key: string]: unknown;
}

const axios = useAxios();

const services = ref<Service[]>([]);
const isLoading = ref(false);

const getUsers = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    isLoading.value = true;
    const { data } = await axios.get<{ services: Service[] }>(
      apiUrl + "/api/services"
    );
    services.value = data.services;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getUsers();
});
</script>

<template>
  <PageLayout>
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
  </PageLayout>
</template>

<style></style>
