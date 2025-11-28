<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppLoader'
});

</script>

<template>
    <div class="app-loader"><i class="fas fa-spinner fa-5x fa-spin-pulse"></i></div>
</template>

<style scoped lang="scss">
.app-loader {
    position: fixed;
    inset: 0;
    background-color: #d2d2d2;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>