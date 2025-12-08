<script setup lang="ts">
import { ref } from "vue";
import Carousel from "primevue/carousel";

interface Slide {
  id: number;
  src: string;
  alt: string;
}

const slides = ref<Slide[]>([
  {
    id: 1,
    alt: "Lavoro unghie 1",
    src: "/images/gallery-01.jpeg",
  },
  {
    id: 2,
    alt: "Lavoro unghie 2",
    src: "/images/gallery-02.jpeg",
  },
  {
    id: 3,
    alt: "Lavoro unghie 3",
    src: "/images/gallery-03.jpeg",
  },
  {
    id: 4,
    alt: "Lavoro unghie 4",
    src: "/images/gallery-04.jpeg",
  },
  {
    id: 5,
    alt: "Lavoro unghie 5",
    src: "/images/gallery-05.jpeg",
  },
  {
    id: 6,
    alt: "Lavoro unghie 6",
    src: "/images/gallery-06.jpeg",
  },
  {
    id: 7,
    alt: "Lavoro unghie 7",
    src: "/images/gallery-07.jpeg",
  },
  {
    id: 8,
    alt: "Lavoro unghie 8",
    src: "/images/gallery-08.jpeg",
  },
  {
    id: 9,
    alt: "Lavoro unghie 9",
    src: "/images/gallery-09.jpeg",
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
        :src="data.src"
        :alt="data.alt"
        class="w-full h-64 object-cover"
        loading="lazy"
      />
    </template>
  </Carousel>
</template>

<style scoped>
:deep(.p-carousel-indicator-button) {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  padding: 0;
  margin: 0 4px;
}

:deep(.p-carousel-indicator-button.p-highlight) {
  background-color: var(--p-primary-600);
}
</style>
