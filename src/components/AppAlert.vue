<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AppAlert',
    props: {
        type: {
            type: String,
            default: 'success',
        },
    }
});

</script>

<template>
    <div class="alert fade show" :class="`alert-${type}`" role="alert">
        <slot></slot>
    </div>
</template>

<style scoped></style>