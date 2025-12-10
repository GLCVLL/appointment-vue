<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import AppLoader from "@/components/AppLoader.vue";
import { useApi } from "@/composables/useApi";
import PageLayout from "@/components/PageLayout.vue";
import Button from "@/components/Button.vue";
import Card from "@/components/Card.vue";
import Icon from "@/components/Icon.vue";
import DatePicker from "@/components/DatePicker.vue";
import TimeSlotPicker from "@/components/TimeSlotPicker.vue";
import { useNavigation } from "@/composables/useNavigation";
import { format, addMonths, endOfMonth } from "date-fns";
import { getUser } from "@/store/auth";
import { useToast } from "primevue/usetoast";

interface Service {
  id: number;
  name: string;
  duration: string;
  [key: string]: unknown;
}

interface MockAppointment {
  id: number;
  date: string;
  startTime: string;
  services: string[];
}

const axios = useApi();
const { authLinks } = useNavigation();
const toast = useToast();

const services = ref<Service[]>([]);
const isLoading = ref(false);
const selectedDate = ref<string | null>(null);
const selectedTime = ref<string | null>(null);
const selectedServices = ref<number[]>([]);

// Calcola la data minima (oggi) e massima (ultimo giorno del mese successivo)
const minDate = computed((): string => {
  return format(new Date(), "yyyy-MM-dd");
});

const maxDate = computed((): string => {
  const nextMonth = addMonths(new Date(), 1);
  const lastDayOfNextMonth = endOfMonth(nextMonth);
  return format(lastDayOfNextMonth, "yyyy-MM-dd");
});

// Computed per verificare se ci sono servizi selezionati
const hasSelectedServices = computed((): boolean => {
  return selectedServices.value.length > 0;
});

// Watcher per resettare la data quando non ci sono servizi selezionati
watch(selectedServices, (newValue) => {
  if (newValue.length === 0) {
    selectedDate.value = null;
    selectedTime.value = null;
  }
});

// Watcher per resettare l'orario quando la data cambia
watch(selectedDate, (newValue) => {
  if (!newValue) {
    selectedTime.value = null;
  }
});

// Mock appointments data
const mockAppointments = ref<MockAppointment[]>([
  {
    id: 1,
    date: "2024-01-15",
    startTime: "10:00",
    services: ["Taglio di capelli"],
  },
  {
    id: 2,
    date: "2024-01-20",
    startTime: "14:30",
    services: ["Barba"],
  },
  {
    id: 3,
    date: "2024-01-25",
    startTime: "11:00",
    services: ["Taglio di capelli", "Barba"],
  },
  {
    id: 4,
    date: "2024-02-01",
    startTime: "15:00",
    services: ["Taglio di capelli"],
  },
  {
    id: 5,
    date: "2024-02-05",
    startTime: "09:30",
    services: ["Barba", "Trattamento viso"],
  },
]);

const getServices = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    isLoading.value = true;
    const { data } = await axios.get<{ services: Service[] }>(
      apiUrl + "/api/services"
    );
    services.value = data.services;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

// Updates available booking hours based on selected services and date
// const updateBookingHours = (): void => {
//   const slotDuration = 30; // Duration of each time slot in minutes
//   const selectedDate = appointmentForm.value.date;

//   timeArray.value = []; // Reset available time slots

//   // Skip if the selected date is a closed day
//   if (closedDays.value.includes(selectedDate)) return;

//   // Calculate available time slots based on service duration
//   const selectedSlotsNumber = selectedDuration.value / slotDuration;
//   slotDays.value.forEach((slotDay) => {
//     if (slotDay.date === selectedDate) {
//       slotDay.slots.forEach((slot, idx) => {
//         if (slot.status === "") {
//           let isAvailable = true;
//           for (let i = 1; i < selectedSlotsNumber; i++) {
//             if (
//               idx + i >= slotDay.slots.length ||
//               slotDay.slots[idx + i].status === "booked"
//             ) {
//               isAvailable = false;
//             }
//           }
//           if (isAvailable) {
//             timeArray.value.push(slot.hour);
//           }
//         }
//       });
//     }
//   });

//   // Reset start time if it's no longer available
//   if (!timeArray.value.includes(appointmentForm.value.start_time)) {
//     appointmentForm.value.start_time = "";
//   }
// };

// Fetches slot days data from the server
// const fetchSlotDays = async (): Promise<void> => {
//   try {
//     const apiUrl = import.meta.env.VITE_BASEURI as string;
//     const { data } = await axios.get<{
//       slotDays: SlotDay[];
//       closedDays: string[];
//     }>(`${apiUrl}/api/booking-hours`);
//     console.log(data);
//     // slotDays.value = data.slotDays;
//     // closedDays.value = data.closedDays;
//   } catch (error) {
//     console.error("Error loading data:", error);
//   }
// };

const handleBook = async (): Promise<void> => {
  // Validazione: verifica che tutti i campi siano selezionati
  if (
    !selectedDate.value ||
    !selectedTime.value ||
    selectedServices.value.length === 0
  ) {
    return;
  }

  const apiUrl = import.meta.env.VITE_BASEURI as string;
  isLoading.value = true;

  try {
    const user = getUser();
    if (!user) {
      console.error("Utente non autenticato");
      return;
    }

    const payload = {
      user_id: user.id,
      date: selectedDate.value,
      start_time: selectedTime.value,
      services: selectedServices.value,
    };

    await axios.post(`${apiUrl}/api/appointments`, payload);

    // Reset form dopo il successo
    selectedDate.value = null;
    selectedTime.value = null;
    selectedServices.value = [];

    // Mostra toast di successo
    toast.add({
      severity: "success",
      summary: "Successo",
      detail: "Appuntamento prenotato con successo",
      life: 3000,
    });
  } catch (err: unknown) {
    const axiosError = err as {
      response?: {
        status?: number;
        data?: { errors?: Record<string, string[]>; message?: string };
      };
    };

    // Estrai il messaggio di errore dal backend
    let errorMessage = "Si è verificato un errore durante la prenotazione";

    if (axiosError.response?.data) {
      const responseData = axiosError.response.data;
      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.errors) {
        // Se ci sono errori di validazione, prendi il primo
        const firstError = Object.values(responseData.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
    }

    // Mostra toast di errore
    toast.add({
      severity: "error",
      summary: "Errore",
      detail: errorMessage,
      life: 5000,
    });
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  getServices();
  // fetchSlotDays();
});
</script>

<template>
  <PageLayout :links="authLinks">
    <div class="max-w-7xl mx-auto px-4 my-4">
      <!-- Sezione alta: Card appuntamenti -->
      <section class="mb-8">
        <h2 class="mb-4 text-xl font-semibold">I tuoi appuntamenti</h2>
        <div v-if="mockAppointments.length === 0" class="text-center py-8">
          <div class="text-primary-400 mb-4 flex justify-center">
            <Icon name="calendar" size="64px" />
          </div>
          <p class="text-primary-500 mb-4">Nessun appuntamento prenotato</p>
        </div>
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          <Card
            v-for="appointment in mockAppointments"
            :key="appointment.id"
            class="aspect-square max-w-[200px]"
          >
            <div class="flex flex-col h-full justify-between">
              <div>
                <div class="text-sm text-gray-600 mb-2">
                  {{ formatDate(appointment.date) }}
                </div>
                <div class="text-lg font-semibold mb-2">
                  {{ appointment.startTime }}
                </div>
                <div class="text-sm mb-3">
                  <div
                    v-for="(service, index) in appointment.services"
                    :key="index"
                  >
                    {{ service }}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Sezione bassa: Servizi per prenotazione -->
      <section>
        <h2 class="mb-4 text-xl font-semibold">Prenota un appuntamento</h2>
        <Card>
          <AppLoader v-if="isLoading" />

          <div v-else class="flex flex-col gap-6">
            <!-- Parte 1: Servizi -->
            <div class="flex flex-col">
              <p v-if="services.length === 0" class="text-pink-500">
                Nessun servizio disponibile al momento.
              </p>
              <div v-else>
                <p class="mb-3 text-sm font-medium">Servizi disponibili</p>
                <div class="flex flex-col gap-3">
                  <label
                    v-for="service in services"
                    :key="service.id"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :id="`service-${service.id}`"
                      :value="service.id"
                      v-model="selectedServices"
                      class="w-4 h-4 appearance-none bg-white border-gray-300 border-2 rounded focus:ring-primary-500 focus:ring-2 checked:bg-primary-600 checked:border-primary-600"
                    />
                    <span class="text-sm">{{ service.name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Parte 2: Data -->
            <div class="flex flex-col">
              <p class="mb-3 text-sm font-medium">Seleziona data</p>
              <DatePicker
                v-model="selectedDate"
                :min="minDate"
                :max="maxDate"
                :disabled="!hasSelectedServices"
              />
            </div>

            <!-- Parte 3: Orario -->
            <div class="flex flex-col">
              <p class="mb-3 text-sm font-medium">Seleziona orario</p>
              <TimeSlotPicker
                v-model="selectedTime"
                :disabled="!selectedDate || !hasSelectedServices"
              />
            </div>

            <!-- Parte 4: Bottone Prenota -->
            <div>
              <Button
                label="Prenota"
                theme="primary"
                icon="calendar"
                @click="handleBook"
                class="w-full md:w-auto"
              />
            </div>
          </div>
        </Card>
      </section>
    </div>
  </PageLayout>
</template>

<style scoped>
input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414L2.586 10l6.293-6.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
