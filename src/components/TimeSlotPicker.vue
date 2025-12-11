<script setup lang="ts">
import { computed, PropType } from "vue";
import type { TimeSlot } from "@/types/api";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  slots: {
    type: Array as PropType<TimeSlot[]>,
    default: () => [],
  },
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

// Divide gli orari in 3 periodi della giornata basandosi sugli slot dall'API
const morningSlots = computed(() =>
  props.slots.filter((slot) => {
    const hour = parseInt(slot.hour.split(":")[0]);
    const minute = parseInt(slot.hour.split(":")[1]);
    return hour >= 9 && (hour < 11 || (hour === 11 && minute <= 40));
  })
);

const afternoonSlots = computed(() =>
  props.slots.filter((slot) => {
    const hour = parseInt(slot.hour.split(":")[0]);
    const minute = parseInt(slot.hour.split(":")[1]);
    return hour >= 12 && (hour < 15 || (hour === 15 && minute <= 40));
  })
);

const eveningSlots = computed(() =>
  props.slots.filter((slot) => {
    const hour = parseInt(slot.hour.split(":")[0]);
    const minute = parseInt(slot.hour.split(":")[1]);
    return hour >= 16 && (hour < 17 || (hour === 17 && minute <= 40));
  })
);

const selectTime = (slot: TimeSlot): void => {
  if (props.disabled) return;
  if (props.modelValue === slot.hour) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", slot.hour);
  }
};

const isSelected = (slot: TimeSlot): boolean => {
  return props.modelValue === slot.hour;
};
</script>

<template>
  <div class="time-slot-picker">
    <div class="grid grid-cols-3 gap-4">
      <!-- Mattina: 9:00 - 11:40 -->
      <div class="flex flex-col gap-2">
        <p class="text-xs font-medium text-gray-600 mb-1 text-center">
          Mattina
        </p>
        <div class="flex flex-col gap-2">
          <button
            v-for="slot in morningSlots"
            :key="slot.hour"
            type="button"
            @click="selectTime(slot)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(slot)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ slot.hour }}
          </button>
        </div>
      </div>

      <!-- Pomeriggio: 12:00 - 15:40 -->
      <div class="flex flex-col gap-2">
        <p class="text-xs font-medium text-gray-600 mb-1 text-center">
          Pomeriggio
        </p>
        <div class="flex flex-col gap-2">
          <button
            v-for="slot in afternoonSlots"
            :key="slot.hour"
            type="button"
            @click="selectTime(slot)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(slot)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ slot.hour }}
          </button>
        </div>
      </div>

      <!-- Sera: 16:00 - 17:40 -->
      <div class="flex flex-col gap-2">
        <p class="text-xs font-medium text-gray-600 mb-1 text-center">Sera</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="slot in eveningSlots"
            :key="slot.hour"
            type="button"
            @click="selectTime(slot)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(slot)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ slot.hour }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.time-slot-picker button:not(:disabled):hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
