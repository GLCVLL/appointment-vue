<script setup lang="ts">
import PrimeDatePicker from "primevue/datepicker";
import { PropType, computed } from "vue";
import { format, parseISO, isValid } from "date-fns";

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
  },
  min: {
    type: [Date, String] as PropType<Date | string | null>,
  },
  max: {
    type: [Date, String] as PropType<Date | string | null>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits({
  "update:modelValue": (_value: string | null) => true,
});

const internalValue = computed((): Date | undefined => {
  if (!props.modelValue) return undefined;

  try {
    const date = parseISO(props.modelValue);
    if (isValid(date)) {
      return date;
    }
  } catch {
    // Invalid date string
  }
  return undefined;
});

const minDate = computed((): Date | undefined => {
  if (!props.min) return undefined;
  if (props.min instanceof Date) return props.min;
  try {
    const date = parseISO(props.min);
    if (isValid(date)) {
      return date;
    }
  } catch {
    // Invalid date string
  }
  return undefined;
});

const maxDate = computed((): Date | undefined => {
  if (!props.max) return undefined;
  if (props.max instanceof Date) return props.max;
  try {
    const date = parseISO(props.max);
    if (isValid(date)) {
      return date;
    }
  } catch {
    // Invalid date string
  }
  return undefined;
});

const handleUpdate = (
  value: Date | Date[] | (Date | null)[] | null | undefined
): void => {
  if (value === null || value === undefined) {
    emit("update:modelValue", null);
    return;
  }

  // Handle single Date (not array)
  if (value instanceof Date && isValid(value)) {
    const formattedDate = format(value, "yyyy-MM-dd");
    emit("update:modelValue", formattedDate);
    return;
  }

  // If it's an array, take the first valid date
  if (Array.isArray(value) && value.length > 0) {
    const firstDate = value[0];
    if (firstDate instanceof Date && isValid(firstDate)) {
      const formattedDate = format(firstDate, "yyyy-MM-dd");
      emit("update:modelValue", formattedDate);
      return;
    }
  }

  emit("update:modelValue", null);
};
</script>

<template>
  <PrimeDatePicker
    :modelValue="internalValue"
    :minDate="minDate"
    :maxDate="maxDate"
    :disabled="disabled"
    @update:modelValue="handleUpdate"
    showIcon
  />
</template>
