<script setup lang="ts">
import { ref } from "vue";
import Carousel from "primevue/carousel";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const slides = ref<Slide[]>([
  {
    id: 1,
    title: "Accoglienza",
    description:
      "Spazi luminosi e curati per mettere a proprio agio chi arriva in studio.",
    image: "https://picsum.photos/seed/appointment-welcome/900/550",
  },
  {
    id: 2,
    title: "Team all'opera",
    description:
      "Uno sguardo dietro le quinte mentre il team si occupa delle prenotazioni.",
    image: "https://picsum.photos/seed/appointment-team/900/550",
  },
  {
    id: 3,
    title: "Attesa serena",
    description:
      "Una sala d'attesa pensata per offrire comfort e relax prima dell'appuntamento.",
    image: "https://picsum.photos/seed/appointment-lounge/900/550",
  },
  {
    id: 4,
    title: "Dettagli curati",
    description:
      "Materiali naturali e colori caldi per un ambiente professionale ma accogliente.",
    image: "https://picsum.photos/seed/appointment-details/900/550",
  },
  {
    id: 5,
    title: "Focus sulle persone",
    description:
      "Ogni appuntamento è un momento dedicato, con attenzione personalizzata.",
    image: "https://picsum.photos/seed/appointment-care/900/550",
  },
  {
    id: 6,
    title: "Tecnologia a supporto",
    description:
      "Strumenti digitali che semplificano la gestione e rendono tutto più veloce.",
    image: "https://picsum.photos/seed/appointment-tech/900/550",
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
