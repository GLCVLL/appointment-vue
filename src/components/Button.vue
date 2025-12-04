<script setup lang="ts">
import PrimeButton from "primevue/button";
import { PropType } from "vue";
import Icon, { IconName } from "@/components/Icon.vue";

type ButtonTheme =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "help"
  | "contrast";

type ButtonType = "button" | "submit";

const props = defineProps({
  label: {
    type: String,
  },
  icon: {
    type: String as PropType<IconName>,
  },
  theme: {
    type: String as PropType<ButtonTheme>,
    default: "primary",
  },
  type: {
    type: String as PropType<ButtonType>,
    default: "button",
  },
  variant: {
    type: String as PropType<"outlined" | "text" | "link">,
  },
});
</script>

<template>
  <PrimeButton :severity="theme" :type="type" :label="label" :variant="variant">
    <template v-if="icon" #icon>
      <Icon :name="icon" size="18px" />
    </template>
  </PrimeButton>
</template>
