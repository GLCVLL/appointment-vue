<script setup lang="ts">
import Button from "@/components/Button.vue";
import Card from "primevue/card";
import { useRouter } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: "GC Nail Art",
  },
  description: {
    type: String,
    default: "Trattamenti per le unghie con stile e qualità.",
  },
  imageUrl: {
    type: String,
    default: "https://picsum.photos/seed/jumbotron-hero/1920/1080",
  },
});

// DATA
const router = useRouter();

// HANDLERS
const goToLogin = (): void => {
  router.push({ name: "login" });
};
</script>

<template>
  <section
    class="jumbotron-section relative min-h-screen flex items-center justify-center"
    :style="{ backgroundImage: `url(${imageUrl})` }"
  >
    <div class="absolute inset-0 bg-black/30"></div>
    <div class="relative z-10 w-full max-w-4xl px-4">
      <Card class="bg-white/20 backdrop-blur-md border-none shadow-2xl">
        <template #content>
          <div class="text-center py-8 px-6">
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {{ title }}
            </h1>
            <p class="text-xl md:text-2xl text-white mb-6">
              {{ description }}
            </p>

            <Button label="Prenota Ora" theme="primary" @click="goToLogin" />
          </div>
        </template>
      </Card>
    </div>
  </section>
</template>

<style scoped>
.jumbotron-section {
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>
