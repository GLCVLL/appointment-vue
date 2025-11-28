<script setup lang="ts">
// No props or logic needed for this component
</script>

<template>
    <div class="app-loader"><i class="fas fa-spinner fa-5x fa-spin-pulse"></i></div>
</template>

<style scoped>
.app-loader {
    position: fixed;
    inset: 0;
    background-color: #d2d2d2;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
