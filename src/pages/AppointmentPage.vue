<script>
import { getUser } from '../store/auth.js';
export default {
    name: 'AppointmentPage',

    // Data properties for the component
    data() {
        return {
            userId: null,
            services: [],        // Stores services data
            slotDays: [],        // Stores available slot days
            closedDays: [],      // Stores closed days
            timeArray: [],       // Stores available time slots
            appointmentForm: {   // Form data for appointment
                date: '',        // Selected date for the appointment
                startTime: '',   // Selected start time for the appointment
                notes: '',       // Additional notes for the appointment
                services: [],    // Selected services for the appointment
            },
        };
    },

    methods: {
        // Updates available booking hours based on selected services and date
        updateBookingHours() {
            const slotDuration = 30; // Duration of each time slot in minutes
            const selectedDate = this.appointmentForm.date;

            let selectedDuration = 0; // Total duration of selected services

            // Calculate total duration of selected services
            this.appointmentForm.services.forEach(serviceId => {
                const durationStr = this.services.find(service => service.id === serviceId).duration
                const [hours, minutes, seconds] = durationStr.split(':').map(Number);
                selectedDuration += hours * 60 + minutes + Math.round(seconds / 60);
            });

            this.timeArray = []; // Reset available time slots

            // Skip if the selected date is a closed day
            if (this.closedDays.includes(selectedDate)) return

            // Calculate available time slots based on service duration
            const selectedSlotsNumber = selectedDuration / slotDuration;
            this.slotDays.forEach(slotDay => {
                if (slotDay.date === selectedDate) {
                    slotDay.slots.forEach((slot, idx) => {
                        if (slot.status === '') {
                            let isAvailable = true;
                            for (let i = 1; i < selectedSlotsNumber; i++) {
                                if (idx + i >= slotDay.slots.length || slotDay.slots[idx + i].status === 'booked') {
                                    isAvailable = false;
                                };
                            }
                            if (isAvailable) {
                                this.timeArray.push(slot.hour)
                            }
                        }
                    })
                }
            });

            // Reset start time if it's no longer available
            if (!this.timeArray.includes(this.appointmentForm.startTime)) {
                this.appointmentForm.startTime = '';
            }
        },

        // Fetches slot days data from the server
        async fetchSlotDays() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                const { data } = await this.$axios.get(`${apiUrl}/api/booking-hours`);
                this.slotDays = data.slotDays;
                this.closedDays = data.closedDays;
            } catch (error) {
                console.error("Error loading data:", error);
            }
        },

        // Fetches services data from the server
        async fetchServices() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                const { data } = await this.$axios.get(`${apiUrl}/api/services`);
                this.services = data.services;
            } catch (error) {
                console.error("Error loading data:", error);
            }
        },

        // Submits the appointment form
        async submitForm() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                const payload = {
                    date: this.appointmentForm.date,
                    startTime: this.appointmentForm.startTime,
                    endTime: this.appointmentForm.endTime,
                    notes: this.appointmentForm.notes
                };

                const response = await this.$axios.post(`${apiUrl}/api/appointments`, payload);
                console.log("Appointment successfully created", response.data);
            } catch (e) {
                console.error("Error submitting form:", e);
            }
        }
    },

    // Lifecycle hook to load initial data
    mounted() {
        this.fetchServices();
        this.fetchSlotDays();
        this.userId = getUser().id;
    }
};
</script>

<template>
    <div class="container mt-4">
        <form @submit.prevent="submitForm">
            <div class="row mb-3">
                <!-- Services -->
                <div class="col-12 my-2">
                    <p>Services</p>
                    <div class="d-flex flex-wrap gap-3">
                        <div class="form-check" v-for="service in services" :key="service.id">
                            <input class="form-check-input" type="checkbox" :id="`service-${service.id}`"
                                :value="service.id" v-model="appointmentForm.services" @change="updateBookingHours">
                            <label :for="`service-${service.id}`" class="form-check-label">{{ service.name }}</label>
                        </div>
                    </div>
                </div>
                <!-- Date Picker -->
                <div class="col-md-6 my-2">
                    <label for="date" class="form-label">Appointment Date</label>
                    <input @change="updateBookingHours" type="date" id="date" class="form-control"
                        v-model="appointmentForm.date">
                </div>
                <!-- Time Selectors -->
                <div class="col-md-6 my-2">
                    <label for="start_time" class="form-label">Start Time</label>
                    <select id="start_time" class="form-select" v-model="appointmentForm.startTime">
                        <option value="" disabled>----</option>
                        <option v-for="time in timeArray" :key="time">{{ time }}</option>
                    </select>
                </div>
                <!-- Additional Notes -->
                <div class="col-12 my-2">
                    <label for="notes" class="form-label">Notes</label>
                    <textarea id="notes" class="form-control" v-model="appointmentForm.notes"
                        placeholder="Enter additional notes"></textarea>
                </div>

                <!-- Submit Button -->
                <div class="col-12 my-2">
                    <button type="submit" class="btn btn-primary">Confirm</button>
                </div>
            </div>
        </form>
    </div>
</template>