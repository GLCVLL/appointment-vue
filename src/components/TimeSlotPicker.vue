<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();

// Genera orari ogni 20 minuti fino a 17:40
const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      // Ferma a 17:40
      if (hour === 17 && minute > 40) break;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Divide gli orari in 3 periodi della giornata
const morningSlots = computed(() =>
  timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    const minute = parseInt(time.split(":")[1]);
    return hour >= 9 && (hour < 11 || (hour === 11 && minute <= 40));
  })
);

const afternoonSlots = computed(() =>
  timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    const minute = parseInt(time.split(":")[1]);
    return hour >= 12 && (hour < 15 || (hour === 15 && minute <= 40));
  })
);

const eveningSlots = computed(() =>
  timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    const minute = parseInt(time.split(":")[1]);
    return hour >= 16 && (hour < 17 || (hour === 17 && minute <= 40));
  })
);

const selectTime = (time: string): void => {
  if (props.disabled) return;
  if (props.modelValue === time) {
    emit("update:modelValue", null);
  } else {
    emit("update:modelValue", time);
  }
};

const isSelected = (time: string): boolean => {
  return props.modelValue === time;
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
            v-for="time in morningSlots"
            :key="time"
            type="button"
            @click="selectTime(time)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(time)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ time }}
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
            v-for="time in afternoonSlots"
            :key="time"
            type="button"
            @click="selectTime(time)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(time)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ time }}
          </button>
        </div>
      </div>

      <!-- Sera: 16:00 - 17:40 -->
      <div class="flex flex-col gap-2">
        <p class="text-xs font-medium text-gray-600 mb-1 text-center">Sera</p>
        <div class="flex flex-col gap-2">
          <button
            v-for="time in eveningSlots"
            :key="time"
            type="button"
            @click="selectTime(time)"
            :disabled="disabled"
            :class="[
              'w-full h-10 rounded-lg text-sm font-medium transition-colors border-2 flex items-center justify-center cursor-pointer',
              isSelected(time)
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300',
              disabled && 'opacity-50 cursor-not-allowed',
            ]"
          >
            {{ time }}
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
