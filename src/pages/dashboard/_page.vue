<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Icon from "@/components/Icon.vue";
import { useRouter } from "vue-router";
import { useNavigation } from "@/composables/useNavigation";

interface Service {
  id: number;
  name: string;
  duration: string;
  [key: string]: unknown;
}

interface MockAppointment {
  id: number;
  date: string;
  startTime: string;
  services: string[];
}

const axios = useAxios();
const router = useRouter();
const { authLinks } = useNavigation();

const services = ref<Service[]>([]);
const isLoading = ref(false);

// Mock appointments data
const mockAppointments = ref<MockAppointment[]>([
  {
    id: 1,
    date: "2024-01-15",
    startTime: "10:00",
    services: ["Taglio di capelli"],
  },
  {
    id: 2,
    date: "2024-01-20",
    startTime: "14:30",
    services: ["Barba"],
  },
  {
    id: 3,
    date: "2024-01-25",
    startTime: "11:00",
    services: ["Taglio di capelli", "Barba"],
  },
  {
    id: 4,
    date: "2024-02-01",
    startTime: "15:00",
    services: ["Taglio di capelli"],
  },
  {
    id: 5,
    date: "2024-02-05",
    startTime: "09:30",
    services: ["Barba", "Trattamento viso"],
  },
]);

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  getServices();
});
</script>

<template>
  <PageLayout :links="authLinks">
    <div class="max-w-7xl mx-auto px-4 mt-4">
      <!-- Sezione alta: Card appuntamenti -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">I tuoi appuntamenti</h2>
        <div v-if="mockAppointments.length === 0" class="text-center py-8">
          <div class="text-primary-400 mb-4 flex justify-center">
            <Icon name="calendar" size="64px" />
          </div>
          <p class="text-primary-500 mb-4">Nessun appuntamento prenotato</p>
        </div>
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          <Card
            v-for="appointment in mockAppointments"
            :key="appointment.id"
            class="aspect-square max-w-[200px]"
          >
            <div class="flex flex-col h-full justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-2">
                  {{ formatDate(appointment.date) }}
                </div>
                <div class="text-lg font-semibold mb-2">
                  {{ appointment.startTime }}
                </div>
                <div class="text-sm mb-3">
                  <div
                    v-for="(service, index) in appointment.services"
                    :key="index"
                  >
                    {{ service }}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Sezione bassa: Servizi per prenotazione -->
      <section>
        <h2 class="mb-4 text-xl font-semibold">Prenota un appuntamento</h2>
        <Card>
          <AppLoader v-if="isLoading" />

          <div v-else>
            <p v-if="services.length === 0" class="text-gray-500 mb-4">
              Nessun servizio disponibile al momento.
            </p>

            <div v-else class="mb-4">
              <p class="mb-3 text-sm font-medium">Servizi disponibili</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  v-for="service in services"
                  :key="service.id"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :id="`service-${service.id}`"
                    :value="service.id"
                    class="w-4 h-4 appearance-none bg-white border-gray-300 border-2 rounded focus:ring-primary-500 focus:ring-2 checked:bg-primary-600 checked:border-primary-600"
                  />
                  <span class="text-sm">{{ service.name }}</span>
                </label>
              </div>
            </div>

            <div class="mt-4">
              <Button
                label="Prenota un appuntamento"
                theme="primary"
                @click="goToAppointments"
              />
            </div>
          </div>
        </Card>
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L2.586 10l6.293-6.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
