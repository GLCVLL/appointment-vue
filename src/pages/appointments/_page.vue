<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getUser } from "@/store/auth";
import AppLoader from "@/components/AppLoader.vue";
import AppAlert from "@/components/AppAlert.vue";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";

interface Service {
  id: number;
  name: string;
  duration: string;
  [key: string]: unknown;
}

interface Slot {
  hour: string;
  status: string;
  [key: string]: unknown;
}

interface SlotDay {
  date: string;
  slots: Slot[];
  [key: string]: unknown;
}

interface Alert {
  isVisible: boolean;
  type: string;
  message: string;
}

interface AppointmentForm {
  date: string;
  start_time: string;
  notes: string;
  services: number[];
}

interface Errors {
  [key: string]: string;
}

const axios = useAxios();

const userId = ref<number | null>(null);
const services = ref<Service[]>([]); // Stores services data
const slotDays = ref<SlotDay[]>([]); // Stores available slot days
const closedDays = ref<string[]>([]); // Stores closed days
const timeArray = ref<string[]>([]); // Stores available time slots
const errors = ref<Errors>({});
const isLoading = ref(false);
const alert = ref<Alert>({
  isVisible: false,
  type: "success",
  message: "",
});
const appointmentForm = ref<AppointmentForm>({
  // Form data for appointment
  date: "", // Selected date for the appointment
  start_time: "", // Selected start time for the appointment
  notes: "", // Additional notes for the appointment
  services: [], // Selected services for the appointment
});

const selectedDuration = computed((): number => {
  let totalDuration = 0;
  // Calculate total duration of selected services
  appointmentForm.value.services.forEach((serviceId) => {
    const service = services.value.find((service) => service.id === serviceId);
    if (service) {
      const durationStr = service.duration;
      const [hours, minutes, seconds] = durationStr.split(":").map(Number);
      totalDuration += hours * 60 + minutes + Math.round(seconds / 60);
    }
  });
  return totalDuration;
});

const formHasErrors = computed((): boolean => {
  return Object.keys(errors.value).length > 0;
});

// Updates available booking hours based on selected services and date
const updateBookingHours = (): void => {
  const slotDuration = 30; // Duration of each time slot in minutes
  const selectedDate = appointmentForm.value.date;

  timeArray.value = []; // Reset available time slots

  // Skip if the selected date is a closed day
  if (closedDays.value.includes(selectedDate)) return;

  // Calculate available time slots based on service duration
  const selectedSlotsNumber = selectedDuration.value / slotDuration;
  slotDays.value.forEach((slotDay) => {
    if (slotDay.date === selectedDate) {
      slotDay.slots.forEach((slot, idx) => {
        if (slot.status === "") {
          let isAvailable = true;
          for (let i = 1; i < selectedSlotsNumber; i++) {
            if (
              idx + i >= slotDay.slots.length ||
              slotDay.slots[idx + i].status === "booked"
            ) {
              isAvailable = false;
            }
          }
          if (isAvailable) {
            timeArray.value.push(slot.hour);
          }
        }
      });
    }
  });

  // Reset start time if it's no longer available
  if (!timeArray.value.includes(appointmentForm.value.start_time)) {
    appointmentForm.value.start_time = "";
  }
};

// Fetches slot days data from the server
const fetchSlotDays = async (): Promise<void> => {
  try {
    const apiUrl = import.meta.env.VITE_BASEURI as string;
    const { data } = await axios.get<{
      slotDays: SlotDay[];
      closedDays: string[];
    }>(`${apiUrl}/api/booking-hours`);
    slotDays.value = data.slotDays;
    closedDays.value = data.closedDays;
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Fetches services data from the server
const fetchServices = async (): Promise<void> => {
  try {
    const apiUrl = import.meta.env.VITE_BASEURI as string;
    isLoading.value = true;
    const { data } = await axios.get<{ services: Service[] }>(
      `${apiUrl}/api/services`
    );
    services.value = data.services;
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    isLoading.value = false;
  }
};

const validateAppointmentForm = (): void => {
  const validationErrors: Errors = {};
  if (!appointmentForm.value.date)
    validationErrors.date = "The date field is mandatory";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentForm.value.date))
    validationErrors.date = "Insert a valide date";
  if (!appointmentForm.value.start_time)
    validationErrors.start_time = "The start time field is mandatory";
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentForm.value.start_time))
    validationErrors.start_time = "Insert a valide time";
  if (!appointmentForm.value.services.length)
    validationErrors.services = "The service field is mandatory";
  errors.value = validationErrors;
};

// Submits the appointment form
const submitForm = (): void => {
  errors.value = {};
  validateAppointmentForm();
  if (!formHasErrors.value && userId.value) {
    // calculate end_time string
    const selectedStartTime = new Date(
      appointmentForm.value.date + "T" + appointmentForm.value.start_time
    );
    selectedStartTime.setMinutes(
      selectedStartTime.getMinutes() + selectedDuration.value
    );
    const endTimeString = selectedStartTime
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5);

    const apiUrl = import.meta.env.VITE_BASEURI as string;
    const payload = {
      user_id: userId.value,
      services: appointmentForm.value.services,
      date: appointmentForm.value.date,
      start_time: appointmentForm.value.start_time,
      end_time: endTimeString,
      notes: appointmentForm.value.notes,
    };

    isLoading.value = true;

    alert.value = {
      isVisible: false,
      type: "success",
      message: "",
    };

    axios
      .post(`${apiUrl}/api/appointments`, payload)
      .then(() => {
        alert.value = {
          isVisible: true,
          type: "success",
          message: "Appointment successfully created",
        };

        // update slotDays
        fetchSlotDays();

        // reset
        appointmentForm.value = {
          date: "",
          start_time: "",
          notes: "",
          services: [],
        };
      })
      .catch((err: unknown) => {
        console.log(err);
        // Backend Validation Error
        const axiosError = err as {
          response?: {
            status?: number;
            data?: { errors?: Record<string, string[]>; appErrors?: string };
          };
        };
        if (axiosError.response && axiosError.response.status === 400) {
          // Get Errors
          const { errors: responseErrors, appErrors } =
            axiosError.response.data || {};

          // Reset Messages
          const errorMessages: Errors = {};

          // Set Error Messages
          if (responseErrors) {
            for (const field in responseErrors) {
              errorMessages[field] = responseErrors[field][0];
            }
          }
          errors.value = { ...errorMessages };

          // Set AppAlert
          if (appErrors) {
            alert.value = {
              isVisible: true,
              type: "danger",
              message: appErrors,
            };
          }
        } else {
          // Other Errors
          errors.value = { network: "Something went wrong" };
          alert.value = {
            isVisible: true,
            type: "danger",
            message: "Something went wrong",
          };
        }
      })
      .then(() => {
        isLoading.value = false;
      });
  }
};

// Lifecycle hook to load initial data
onMounted(() => {
  fetchServices();
  fetchSlotDays();
  const user = getUser();
  if (user) {
    userId.value = user.id;
  }
});
</script>

<template>
  <PageLayout>
    <div class="container mt-4">
      <AppAlert v-if="alert.isVisible" :type="alert.type">{{
        alert.message
      }}</AppAlert>
      <form @submit.prevent="submitForm" method="POST">
        <div class="row mb-3">
          <!-- Services -->
          <div class="col-12 my-2">
            <p>Services</p>
            <div
              class="d-flex flex-wrap gap-3 rounded"
              :class="{ 'border border-danger': errors.services }"
            >
              <div
                class="form-check"
                v-for="service in services"
                :key="service.id"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`service-${service.id}`"
                  :value="service.id"
                  v-model="appointmentForm.services"
                  @change="updateBookingHours"
                />
                <label :for="`service-${service.id}`" class="form-check-label">{{
                  service.name
                }}</label>
              </div>
            </div>
            <div class="text-danger">{{ errors.services }}</div>
          </div>
          <!-- Date Picker -->
          <div class="col-md-6 my-2">
            <label for="date" class="form-label">Appointment Date</label>
            <input
              @change="updateBookingHours"
              :class="{ 'is-invalid': errors.date }"
              type="date"
              id="date"
              class="form-control"
              v-model="appointmentForm.date"
            />
            <div class="invalid-feedback">{{ errors.date }}</div>
          </div>
          <!-- Time Selectors -->
          <div class="col-md-6 my-2">
            <label for="start_time" class="form-label">Start Time</label>
            <select
              id="start_time"
              :class="{ 'is-invalid': errors.start_time }"
              class="form-select"
              v-model="appointmentForm.start_time"
            >
              <option value="" disabled>----</option>
              <option v-for="time in timeArray" :key="time">{{ time }}</option>
            </select>
            <div class="invalid-feedback">{{ errors.start_time }}</div>
          </div>
          <!-- Additional Notes -->
          <div class="col-12 my-2">
            <label for="notes" class="form-label">Notes</label>
            <textarea
              id="notes"
              :class="{ 'is-invalid': errors.notes }"
              class="form-control"
              v-model="appointmentForm.notes"
              placeholder="Enter additional notes"
            ></textarea>
            <div class="invalid-feedback">{{ errors.notes }}</div>
          </div>

          <!-- Submit Button -->
          <div class="col-12 my-2">
            <button type="submit" class="btn btn-primary">Confirm</button>
          </div>
        </div>
      </form>
    </div>
    <AppLoader v-if="isLoading" />
  </PageLayout>
</template>
