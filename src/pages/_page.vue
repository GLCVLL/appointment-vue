<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLogged } from "@/store/auth";
import PageLayout from "@/components/PageLayout.vue";
import Button from "@/components/Button.vue";
import AppLoader from "@/components/AppLoader.vue";

interface Service {
  id: number;
  name: string;
  [key: string]: unknown;
}

const router = useRouter();

const services = ref<Service[]>([]);
const isLoading = ref(false);

const goToLogin = (): void => {
  router.push({ name: "login" });
};

const goToRegister = (): void => {
  router.push({ name: "register" });
};

const goToDashboard = (): void => {
  router.push({ name: "dashboard" });
};

const goToAppointments = (): void => {
  router.push({ name: "appointments" });
};
</script>

<template>
  <PageLayout>
    <!-- Hero Section -->
    <section class="bg-primary-200 text-primary-800 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">Benvenuto</h1>
          <p class="text-xl md:text-2xl">Sistema di gestione appuntamenti</p>
        </div>
      </div>
    </section>

    <!-- Info Section - Servizi -->
    <section class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">
          Servizi disponibili
        </h2>

        <AppLoader v-if="isLoading" />

        <div v-else>
          <p
            v-if="services.length === 0"
            class="text-center text-gray-500 text-lg"
          >
            Nessun servizio disponibile al momento.
          </p>

          <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="service in services"
              :key="service.id"
              class="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 class="text-xl font-semibold text-gray-800">
                {{ service.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Prenotazione -->
    <section class="bg-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4 text-gray-800">
            Pronto a prenotare?
          </h2>
          <p class="text-lg text-gray-600 mb-8">
            <span v-if="isLogged()">
              Accedi alla tua dashboard per prenotare un appuntamento
            </span>
            <span v-else>
              Accedi o registrati per prenotare il tuo appuntamento
            </span>
          </p>
          <div v-if="isLogged()" class="flex gap-4 justify-center">
            <Button
              label="Vai alla Dashboard"
              theme="primary"
              @click="goToDashboard"
            />
            <Button
              label="Prenota un appuntamento"
              theme="secondary"
              @click="goToAppointments"
            />
          </div>
          <div v-else class="flex gap-4 justify-center">
            <Button label="Accedi" theme="primary" @click="goToLogin" />
            <Button
              label="Registrati"
              theme="secondary"
              @click="goToRegister"
            />
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<style></style>
