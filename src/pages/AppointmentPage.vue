<script>
export default {
    name: 'AppointmentPage',
    data() {
        return {
            services: [],
            slotDays: [],
            closedDays: [],
            timeArray: [],
            appointmentForm: {
                date: '',
                startTime: '',
                notes: '',
                services: [],
            },
        };
    },
    methods: {
        updateBookingHours() {

            const slotDuration = 30; // minutes
            const selectedDate = this.appointmentForm.date;

            let selectedDuration = 0;

            this.appointmentForm.services.forEach(serviceId => {
                const durationStr = this.services.find(service => service.id === serviceId).duration
                const [hours, minutes, seconds] = durationStr.split(':').map(Number);
                selectedDuration += hours * 60 + minutes + Math.round(seconds / 60);
            });
            // reset
            this.timeArray = [];

            // check if is a closed day
            if (this.closedDays.includes(selectedDate)) return

            // create timeArray
            const selectedSlotsNumber = selectedDuration / slotDuration;
            this.slotDays.forEach(slotDay => {
                // retrieve selected slot days
                if (slotDay.date === selectedDate) {
                    // check if every slots are not booked
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
            // check if start time is invalid
            if (!this.timeArray.includes(this.appointmentForm.startTime)) {
                this.appointmentForm.startTime = '';
            }

        },
        async fetchSlotDays() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                // BookingHours
                const { data } = await this.$axios.get(`${apiUrl}/api/booking-hours`);
                this.slotDays = data.slotDays;
                this.closedDays = data.closedDays;
            } catch (error) {
                console.error("Errore nel caricamento dei dati:", error);

            }
        },
        async fetchServices() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                // services
                const { data } = await this.$axios.get(`${apiUrl}/api/services`);
                this.services = data.services;
            } catch (error) {
                console.error("Errore nel caricamento dei dati:", error);

            }
        },

        async submitForm() {
            try {
                const apiUrl = import.meta.env.VITE_BASEURI;
                const payload = {
                    date: this.date,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    notes: this.notes
                };

                // form
                const response = await this.$axios.post(`${apiUrl}/api/appointments`, payload);
                console.log("Appuntamento creato con successo", response.data);

            } catch (e) {
                console.error(e);
            }
        }
    },
    mounted() {
        this.fetchServices();
        this.fetchSlotDays();
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