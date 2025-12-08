<script setup lang="ts">
import { PropType, ref } from "vue";
import UserProfile from "@/components/UserProfile.vue";
import AppLogo from "@/components/AppLogo.vue";
import Button from "@/components/Button.vue";
import MobileMenu from "@/components/MobileMenu.vue";
import { isLogged } from "@/store/auth";
import Icon from "@/components/Icon.vue";
import { Link } from "@/composables/useNavigation";

const props = defineProps({
  links: {
    type: Array as PropType<Link[]>,
    default: () => [],
  },
});

const emit = defineEmits({
  menuToggle: () => true,
});

// DATA
const mobileMenuVisible = ref(false);

// HANDLERS
const handleMenuToggle = (): void => {
  mobileMenuVisible.value = true;
  emit("menuToggle");
};
</script>

<template>
  <div
    class="border-b border-primary-100 rounded-none h-16 flex items-center justify-between px-4"
  >
    <div class="flex items-center gap-4">
      <!-- Logo -->
      <AppLogo />
    </div>
    <div class="flex gap-2 items-center">
      <div class="hidden md:flex gap-12">
        <!-- Nav links -->
        <ul class="hidden md:flex items-center gap-8">
          <li v-for="link in links" :key="link.url">
            <a
              :href="link.url"
              class="text-primary-600 hover:text-primary-900 transition-colors"
            >
              <Icon v-if="link.icon" :name="link.icon" />
              {{ link.label }}
            </a>
          </li>
        </ul>

        <div v-if="isLogged()">
          <UserProfile />
        </div>
        <div v-else class="flex gap-4">
          <RouterLink
            to="/login"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Accedi</RouterLink
          >
          <RouterLink
            to="/register"
            class="text-primary-600 hover:text-primary-900 transition-colors"
            >Registrati</RouterLink
          >
        </div>
      </div>

      <Button
        icon="menu"
        @click="handleMenuToggle"
        variant="text"
        class="md:hidden"
      />
    </div>
  </div>

  <MobileMenu v-model:visible="mobileMenuVisible" :links="links" />
</template>
