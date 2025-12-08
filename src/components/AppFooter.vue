<script setup lang="ts">
import Icon from "@/components/Icon.vue";
import { computed } from "vue";

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="bg-white text-primary-500 pt-4 pb-4">
    <!-- Contatti e indirizzo -->
    <div
      class="container mx-auto px-4 mb-4 flex flex-col md:flex-row items-center md:items-start gap-6"
    >
      <!-- Contatti -->
      <div class="flex-1">
        <div
          class="flex items-center md:items-start gap-2 mb-2 justify-center md:justify-start"
        >
          <Icon name="phone" size="20px" class="shrink-0" />
          <div class="text-sm text-center md:text-left">
            <p>+39 350 566 8766</p>
          </div>
        </div>
        <div
          class="flex items-center md:items-start gap-2 justify-center md:justify-start"
        >
          <Icon name="email" size="20px" class="shrink-0" />
          <div class="text-sm text-center md:text-left">
            <a
              href="mailto:cristianagianitelli@libero.it"
              class="hover:underline"
            >
              cristianagianitelli@libero.it
            </a>
          </div>
        </div>
      </div>

      <!-- Indirizzo -->
      <div class="flex-1">
        <div
          class="flex items-center md:items-start gap-2 justify-center md:justify-start"
        >
          <Icon name="location" size="20px" class="shrink-0" />
          <div class="text-sm text-center md:text-left">
            <p>Via Tagliamento 1</p>
            <p>Roccasecca 03038 FR</p>
            <p>ITALIA</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Separatore -->
    <div class="border-t border-primary-300 my-4"></div>

    <!-- Info -->
    <div class="container mx-auto px-4">
      <div
        class="flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
      >
        <!-- Privacy Policy -->
        <div>
          <RouterLink to="/privacy-policy" class="hover:underline">
            Privacy Policy
          </RouterLink>
        </div>

        <!-- Copyright -->
        <div class="text-center">
          <p>&copy; {{ currentYear }} Tutti i diritti riservati</p>
        </div>

        <!-- Social Bar -->
        <div class="flex items-center gap-3">
          <a
            href="mailto:cristianagianitelli@libero.it"
            class="hover:opacity-70 transition-opacity inline-flex items-center justify-center"
            aria-label="Email"
          >
            <Icon name="email" size="24px" />
          </a>

          <a
            href="https://www.instagram.com/gc_nail_art?igsh=MTRnenMyNHRyY3prNg=="
            target="_blank"
            rel="noopener noreferrer"
            class="hover:opacity-70 transition-opacity inline-flex items-center justify-center"
            aria-label="Instagram"
            :style="{ width: '20px', height: '20px' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-full h-full"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
