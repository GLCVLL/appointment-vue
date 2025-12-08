<script setup lang="ts">
import AppBar from "@/components/AppBar.vue";
import AppFooter from "@/components/AppFooter.vue";
import { Link } from "@/composables/useNavigation";
import { PropType } from "vue";

const props = defineProps({
  links: {
    type: Array as PropType<Link[]>,
    default: () => [],
  },
});

// HANDLERS
const handleMenuToggle = () => {
  console.log("menuToggle");
};
</script>

<template>
  <div class="flex flex-col h-screen bg-primary-50 text-primary-800">
    <AppBar :links="links" @menuToggle="handleMenuToggle" />
    <div class="flex-1 overflow-y-auto flex flex-col">
      <main class="flex flex-col grow">
        <slot />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
