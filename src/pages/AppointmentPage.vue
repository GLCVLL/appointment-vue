<script lang="ts">
import { defineComponent } from 'vue';
import { getUser } from '@/store/auth';
import AppLoader from '@/components/AppLoader.vue';
import AppAlert from '@/components/AppAlert.vue';

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

export default defineComponent({
    name: 'AppointmentPage',

    // Data properties for the component
    data() {
        return {
            userId: null as number | null,
            services: [] as Service[],        // Stores services data
            slotDays: [] as SlotDay[],        // Stores available slot days
            closedDays: [] as string[],      // Stores closed days
            timeArray: [] as string[],       // Stores available time slots
            errors: {} as Errors,
            isLoading: false,
            alert: {
                isVisible: false,
                type: 'success',
                message: '',
            } as Alert,
            appointmentForm: {   // Form data for appointment
                date: '',        // Selected date for the appointment
                start_time: '',   // Selected start time for the appointment
                notes: '',       // Additional notes for the appointment
                services: [],    // Selected services for the appointment
            } as AppointmentForm,
        };
    },
    components: {
        AppLoader, AppAlert,
    },
    computed: {
        selectedDuration(): number {
            let selectedDuration = 0;
            // Calculate total duration of selected services
            this.appointmentForm.services.forEach(serviceId => {
                const service = this.services.find(service => service.id === serviceId);
                if (service) {
                    const durationStr = service.duration;
                    const [hours, minutes, seconds] = durationStr.split(':').map(Number);
                    selectedDuration += hours * 60 + minutes + Math.round(seconds / 60);
                }
            });
            return selectedDuration;
        },
        formHasErrors(): boolean {
            return Object.keys(this.errors).length > 0;
        }
    },

    methods: {
        // Updates available booking hours based on selected services and date
        updateBookingHours(): void {
            const slotDuration = 30; // Duration of each time slot in minutes
            const selectedDate = this.appointmentForm.date;

            this.timeArray = []; // Reset available time slots

            // Skip if the selected date is a closed day
            if (this.closedDays.includes(selectedDate)) return;

            // Calculate available time slots based on service duration
            const selectedSlotsNumber = this.selectedDuration / slotDuration;
            this.slotDays.forEach(slotDay => {
                if (slotDay.date === selectedDate) {
                    slotDay.slots.forEach((slot, idx) => {
                        if (slot.status === '') {
                            let isAvailable = true;
                            for (let i = 1; i < selectedSlotsNumber; i++) {
                                if (idx + i >= slotDay.slots.length || slotDay.slots[idx + i].status === 'booked') {
                                    isAvailable = false;
                                }
                            }
                            if (isAvailable) {
                                this.timeArray.push(slot.hour);
                            }
                        }
                    });
                }
            });

            // Reset start time if it's no longer available
            if (!this.timeArray.includes(this.appointmentForm.start_time)) {
                this.appointmentForm.start_time = '';
            }
        },

        // Fetches slot days data from the server
        async fetchSlotDays(): Promise<void> {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI as string;
                const { data } = await this.$axios.get<{ slotDays: SlotDay[]; closedDays: string[] }>(`${apiUrl}/api/booking-hours`);
                this.slotDays = data.slotDays;
                this.closedDays = data.closedDays;
            } catch (error) {
                console.error("Error loading data:", error);
            }
        },

        // Fetches services data from the server
        async fetchServices(): Promise<void> {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI as string;
                this.isLoading = true;
                const { data } = await this.$axios.get<{ services: Service[] }>(`${apiUrl}/api/services`);
                this.services = data.services;
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        validateAppointmentForm(): void {
            const errors: Errors = {};
            if (!this.appointmentForm.date) errors.date = 'The date field is mandatory';
            if (!(/^\d{4}-\d{2}-\d{2}$/.test(this.appointmentForm.date))) errors.date = 'Insert a valide date';
            if (!this.appointmentForm.start_time) errors.start_time = 'The start time field is mandatory';
            if (!(/^([01]\d|2[0-3]):[0-5]\d$/.test(this.appointmentForm.start_time))) errors.start_time = 'Insert a valide time';
            if (!this.appointmentForm.services.length) errors.services = 'The service field is mandatory';
            this.errors = errors;
        },

        // Submits the appointment form
        submitForm(): void {
            this.errors = {};
            this.validateAppointmentForm();
            if (!this.formHasErrors && this.userId) {
                // calculate end_time string
                const selectedStartTime = new Date(this.appointmentForm.date + 'T' + this.appointmentForm.start_time);
                selectedStartTime.setMinutes(selectedStartTime.getMinutes() + this.selectedDuration);
                const endTimeString = selectedStartTime.toTimeString().split(' ')[0].substring(0, 5);

                const apiUrl = import.meta.env.VITE_BASEURI as string;
                const payload = {
                    user_id: this.userId,
                    services: this.appointmentForm.services,
                    date: this.appointmentForm.date,
                    start_time: this.appointmentForm.start_time,
                    end_time: endTimeString,
                    notes: this.appointmentForm.notes
                };

                this.isLoading = true;

                this.alert = {
                    isVisible: false,
                    type: 'success',
                    message: '',
                };

                this.$axios.post(`${apiUrl}/api/appointments`, payload).then(() => {
                    this.alert = {
                        isVisible: true,
                        type: 'success',
                        message: 'Appointment successfully created',
                    };

                    // update slotDays
                    this.fetchSlotDays();

                    // reset
                    this.appointmentForm = {
                        date: '',
                        start_time: '',
                        notes: '',
                        services: [],
                    };
                }).catch((err: unknown) => {
                    console.log(err);
                    // Backend Validation Error
                    const axiosError = err as { response?: { status?: number; data?: { errors?: Record<string, string[]>; appErrors?: string } } };
                    if (axiosError.response && axiosError.response.status === 400) {
                        // Get Errors
                        const { errors, appErrors } = axiosError.response.data || {};

                        // Reset Messages
                        const errorMessages: Errors = {};

                        // Set Error Messages
                        if (errors) {
                            for (const field in errors) {
                                errorMessages[field] = errors[field][0];
                            }
                        }
                        this.errors = { ...errorMessages };

                        // Set AppAlert
                        if (appErrors) {
                            this.alert = {
                                isVisible: true,
                                type: 'danger',
                                message: appErrors,
                            };
                        }
                    } else {
                        // Other Errors
                        this.errors = { network: 'Something went wrong' };
                        this.alert = {
                            isVisible: true,
                            type: 'danger',
                            message: 'Something went wrong',
                        };
                    }
                }).then(() => {
                    this.isLoading = false;
                });
            }
        }
    },

    // Lifecycle hook to load initial data
    mounted() {
        this.fetchServices();
        this.fetchSlotDays();
        const user = getUser();
        if (user) {
            this.userId = user.id;
        }
    }
});
</script>

<template>
    <div class="container mt-4">
        <AppAlert v-if="alert.isVisible" :type="alert.type">{{ alert.message }}</AppAlert>
        <form @submit.prevent="submitForm" method="POST">
            <div class="row mb-3">
                <!-- Services -->
                <div class="col-12 my-2">
                    <p>Services</p>
                    <div class="d-flex flex-wrap gap-3 rounded" :class="{ 'border border-danger': errors.services }">
                        <div class="form-check" v-for="service in services" :key="service.id">
                            <input class="form-check-input" type="checkbox" :id="`service-${service.id}`"
                                :value="service.id" v-model="appointmentForm.services" @change="updateBookingHours">
                            <label :for="`service-${service.id}`" class="form-check-label">{{ service.name }}</label>
                        </div>
                    </div>
                    <div class="text-danger">{{ errors.services }}</div>
                </div>
                <!-- Date Picker -->
                <div class="col-md-6 my-2">
                    <label for="date" class="form-label">Appointment Date</label>
                    <input @change="updateBookingHours" :class="{ 'is-invalid': errors.date }" type="date" id="date"
                        class="form-control" v-model="appointmentForm.date">
                    <div class="invalid-feedback">{{ errors.date }}</div>
                </div>
                <!-- Time Selectors -->
                <div class="col-md-6 my-2">
                    <label for="start_time" class="form-label">Start Time</label>
                    <select id="start_time" :class="{ 'is-invalid': errors.start_time }" class="form-select"
                        v-model="appointmentForm.start_time">
                        <option value="" disabled>----</option>
                        <option v-for="time in timeArray" :key="time">{{ time }}</option>
                    </select>
                    <div class="invalid-feedback">{{ errors.start_time }}</div>
                </div>
                <!-- Additional Notes -->
                <div class="col-12 my-2">
                    <label for="notes" class="form-label">Notes</label>
                    <textarea id="notes" :class="{ 'is-invalid': errors.notes }" class="form-control"
                        v-model="appointmentForm.notes" placeholder="Enter additional notes"></textarea>
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
</template>