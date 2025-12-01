<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  name: {
    type: String as PropType<IconName>,
    required: true,
  },
  size: {
    type: String,
    default: "24px",
  },
});

// ICONS MAP
const iconsMap = {
  user: "person",
  login: "login",
  logout: "logout",
} as const;
export type IconName = keyof typeof iconsMap;

const iconSize = computed(() => {
  if (typeof props.size === "number") {
    return `${props.size}px`;
  }
  return props.size;
});
</script>

<template>
  <span class="material-symbols-outlined" :style="{ fontSize: iconSize }">
    {{ iconsMap[props.name] }}
  </span>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}
</style>
