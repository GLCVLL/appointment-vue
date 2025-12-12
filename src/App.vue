<script setup lang="ts">
import Toast from "@/components/Toast.vue";
import ConfirmDialog from "primevue/confirmdialog";
</script>

<template>
  <Toast />
  <ConfirmDialog :draggable="false" />
  <RouterView />
</template>
