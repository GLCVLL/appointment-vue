<script setup lang="ts">
import Card from "primevue/card";

const props = defineProps({
  title: {
    type: String,
    default: "Benvenuto",
  },
  description: {
    type: String,
    default:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  },
  imageUrl: {
    type: String,
    default: "https://picsum.photos/seed/jumbotron-hero/1920/1080",
  },
});
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
            <p class="text-xl md:text-2xl text-white">
              {{ description }}
            </p>
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
