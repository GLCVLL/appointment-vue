<script setup lang="ts">
import { ref } from "vue";
import Carousel from "primevue/carousel";

interface Slide {
  id: number;
  src: string;
}

const slides = ref<Slide[]>([
  {
    id: 1,
    src: "https://picsum.photos/seed/appointment-welcome/900/550",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/appointment-team/900/550",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/appointment-lounge/900/550",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/appointment-details/900/550",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/appointment-care/900/550",
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/appointment-tech/900/550",
  },
]);

const responsiveOptions = [
  {
    breakpoint: "1280px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "1024px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "640px",
    numVisible: 1,
    numScroll: 1,
  },
];
</script>

<template>
  <Carousel
    :value="slides"
    :num-visible="3"
    :num-scroll="1"
    :responsive-options="responsiveOptions"
    :circular="true"
    :autoplay-interval="4500"
    :show-navigators="false"
    class="gallery-carousel"
  >
    <template #item="{ data }">
      <img
        :src="data.image"
        :alt="data.title"
        class="w-full h-64 object-cover"
        loading="lazy"
      />
    </template>
  </Carousel>
</template>
