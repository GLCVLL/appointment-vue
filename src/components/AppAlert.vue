<script setup lang="ts">
interface Props {
    type?: string;
}

withDefaults(defineProps<Props>(), {
    type: 'success'
});
</script>

<template>
    <div class="alert fade show" :class="`alert-${type}`" role="alert">
        <slot></slot>
    </div>
</template>

<style scoped></style>
