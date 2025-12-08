<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { isLogged } from "@/store/auth";
import Button from "@/components/Button.vue";
import GalleryCarousel from "@/components/GalleryCarousel.vue";
import Icon, { type IconName } from "@/components/Icon.vue";
import Jumbotron from "@/components/Jumbotron.vue";
import PageLayout from "@/components/PageLayout.vue";

interface Service {
  id: number;
  name: string;
  description: string;
  icon: IconName;
  [key: string]: unknown;
}

const router = useRouter();

const services = ref<Service[]>([
  {
    id: 1,
    name: "Manicure Classica",
    description:
      "Trattamento completo delle unghie con taglio, limatura, rimozione cuticole e applicazione smalto tradizionale. Perfetto per una cura quotidiana delle tue mani.",
    icon: "spa",
  },
  {
    id: 2,
    name: "Ricostruzione Unghie",
    description:
      "Ricostruzione professionale con gel o acrilico per unghie forti e resistenti. Ideale per chi ha unghie fragili o vuole allungarle in modo naturale e duraturo.",
    icon: "content_cut",
  },
  {
    id: 3,
    name: "Smalto Semipermanente",
    description:
      "Applicazione di smalto semipermanente che dura fino a 3 settimane senza sfaldarsi. Disponibile in una vasta gamma di colori e finiture per ogni occasione.",
    icon: "palette",
  },
  {
    id: 4,
    name: "Nail Art & Decorazioni",
    description:
      "Creazioni artistiche personalizzate con disegni, glitter, perline e decorazioni uniche. Trasforma le tue unghie in una vera opera d'arte su misura per te.",
    icon: "brush",
  },
]);

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
    <!-- Jumbotron Section -->
    <Jumbotron />

    <!-- Gallery Section -->
    <section class="bg-primary-50 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <p
            class="text-sm font-semibold text-primary-700 uppercase tracking-wide mb-2"
          >
            Galleria
          </p>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-primary-500">
            I Nostri Lavori
          </h2>
        </div>
      </div>
      <GalleryCarousel />
    </section>

    <!-- Services Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <p
            class="text-sm font-semibold text-primary-700 uppercase tracking-wide mb-2"
          >
            Servizi
          </p>
          <h2 class="text-4xl md:text-5xl font-bold mb-4 text-primary-500">
            Trattamenti per le Unghie
          </h2>
        </div>

        <div>
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="service in services"
              :key="service.id"
              class="bg-white rounded-xl p-8 border border-primary-100"
            >
              <div
                class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6"
              >
                <Icon
                  :name="service.icon"
                  size="32px"
                  class="text-primary-600"
                />
              </div>
              <h3 class="text-2xl font-bold text-primary-500 mb-4">
                {{ service.name }}
              </h3>
              <p class="text-primary-500">
                {{ service.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section - Booking -->
    <section class="bg-primary-50 py-16">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4 text-primary-700">
            Pronto a prenotare?
          </h2>
          <p class="text-lg text-primary-600 mb-8">
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
