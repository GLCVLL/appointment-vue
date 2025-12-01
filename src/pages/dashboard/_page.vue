<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";

interface Service {
  id: number;
  name: string;
  [key: string]: unknown;
}

const axios = useAxios();
const router = useRouter();

const services = ref<Service[]>([]);
const isLoading = ref(false);

const getServices = async (): Promise<void> => {
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

const goToAppointments = (): void => {
  router.push({ name: "appointments" });
};

onMounted(() => {
  getServices();
});
</script>

<template>
  <PageLayout>
    <div class="max-w-7xl mx-auto px-4 mt-4">
      <h1 class="mb-4 text-2xl font-bold">Dashboard</h1>

      <div class="w-full md:w-2/3 lg:w-1/2">
        <div class="bg-white rounded-lg shadow-md p-4">
          <h2 class="mb-3 text-xl font-semibold">Servizi disponibili</h2>

          <AppLoader v-if="isLoading" />

          <div v-else>
            <p v-if="services.length === 0" class="text-gray-500">
              Nessun servizio disponibile al momento.
            </p>

            <ul v-else class="list-none mb-4">
              <li
                v-for="service in services"
                :key="service.id"
                class="mb-3 pb-3 border-b border-gray-200 last:border-b-0"
              >
                <h5 class="mb-1 text-lg font-medium">{{ service.name }}</h5>
              </li>
            </ul>

            <div class="mt-4">
              <Button
                label="Prenota un appuntamento"
                theme="primary"
                @click="goToAppointments"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<style></style>
