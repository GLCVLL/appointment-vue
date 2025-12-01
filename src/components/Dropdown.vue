<script setup lang="ts">
import Menu from "primevue/menu";
import { ref, PropType } from "vue";
import Icon, { type IconName } from "@/components/Icon.vue";

export interface MenuItem {
  label: string;
  icon?: IconName;
  command?: () => void;
  disabled?: boolean;
  [key: string]: unknown;
}

const props = defineProps({
  items: {
    type: Array as PropType<MenuItem[]>,
    required: true,
  },
});

// DATA
const menu = ref<InstanceType<typeof Menu> | null>(null);

// HANDLERS
const toggleMenu = (event: Event): void => {
  menu.value?.toggle(event);
};
</script>

<template>
  <div class="relative inline-block">
    <div @click="toggleMenu" class="cursor-pointer">
      <slot />
    </div>
    <Menu ref="menu" :model="items" :popup="true" class="mt-2">
      <template #item="{ item }">
        <div class="flex items-center gap-2 px-4 py-2 cursor-pointer">
          <Icon v-if="item.icon" :name="item.icon as IconName" size="18px" />
          <span>{{ item.label }}</span>
        </div>
      </template>
    </Menu>
  </div>
</template>
