<script setup lang="ts">
// Importing necessary components
import { ref, computed } from 'vue';
import AppAlert from '@/components/AppAlert.vue';
import AppLoader from '@/components/AppLoader.vue';
import { useAxios } from '@/composables/useAxios';
import PageLayout from '@/components/PageLayout.vue';

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface Alert {
    isVisible: boolean;
    type: string;
    message: string;
}

interface Errors {
    [key: string]: string;
}

const axios = useAxios();

const form = ref<FormData>({ // Form data for registration
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const isLoading = ref(false); // Loading state for async operations
const alert = ref<Alert>({ // Alert message object
    isVisible: false,
    type: 'success',
    message: '',
});
const isUserCreated = ref(false); // Flag to check if user registration was successful
const errors = ref<Errors>({}); // Object to hold form validation errors

const formHasErrors = computed((): boolean => { // Checks if there are any validation errors
    return Object.keys(errors.value).length > 0;
});

const submitForm = (): void => { // Function to handle form submission
    errors.value = {}; // Reset errors
    validateForm(); // Validate form
    if (!formHasErrors.value) { // If no errors, proceed to register
        register();
    }
};

const validateForm = (): void => { // Validates form data
    const validationErrors: Errors = {}; // Temporary errors object
    // Validation rules
    if (!form.value.name) validationErrors.name = 'The name field is mandatory';
    if (!form.value.email) validationErrors.email = 'The email field is mandatory';
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.value.email)) validationErrors.email = 'Please insert a valid email';
    if (!form.value.password) validationErrors.password = 'The password field is mandatory';
    else if (form.value.password.length < 5) validationErrors.password = 'The password must be at least 5 characters';
    if (form.value.password !== form.value.password_confirmation) validationErrors.password_confirmation = 'The password confirmation does not match';

    errors.value = validationErrors; // Set component errors to temporary errors
};

const register = async (): Promise<void> => { // Async function to register user
    const apiUrl = import.meta.env.VITE_BASEURI as string; // API URL from environment variable
    isLoading.value = true; // Set loading state

    // Reset alert state
    alert.value = {
        isVisible: false,
        type: 'success',
        message: '',
    };
    try {
        // Get CSRF cookie for Laravel Sanctum
        await axios.get(apiUrl + '/sanctum/csrf-cookie');
        // Post registration data
        await axios.post(`${apiUrl}/api/register`, form.value);
        // On success, show success alert
        alert.value = {
            isVisible: true,
            type: 'success',
            message: 'User successfully created',
        };

        isUserCreated.value = true; // Set user created flag

    } catch (err: unknown) { // Catch and handle errors
        const axiosError = err as { response?: { status?: number; data?: { errors?: Record<string, string[]>; appErrors?: string } } };
        if (axiosError.response && axiosError.response.status === 422) {
            // Extract validation errors from response
            const { errors: responseErrors, appErrors } = axiosError.response.data || {};

            // Convert errors to component format
            const errorMessages: Errors = {};
            if (responseErrors) {
                for (const field in responseErrors) {
                    errorMessages[field] = responseErrors[field][0];
                }
            }
            errors.value = { ...errorMessages };

            // Set alert for app-level errors
            if (appErrors) {
                alert.value = {
                    isVisible: true,
                    type: 'danger',
                    message: appErrors,
                };
            }
        } else { // Handle other errors
            errors.value = { network: 'Something went wrong' };
            alert.value = {
                isVisible: true,
                type: 'danger',
                message: 'Something went wrong',
            };
        }
    } finally {
        isLoading.value = false; // Reset loading state
    }
};
</script>

<template>
    <PageLayout>
        <div class="container">
            <h1>Register Page</h1>

            <AppAlert v-if="alert.isVisible" :type="alert.type">{{ alert.message }}</AppAlert>

            <form v-if="!isUserCreated" @submit.prevent="submitForm" novalidate>
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" :class="{ 'is-invalid': errors.name }" id="name"
                        v-model="form.name">
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="email"
                        v-model="form.email">
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" :class="{ 'is-invalid': errors.password }" id="password"
                        v-model="form.password">
                    <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
                </div>

                <div class="mb-3">
                    <label for="password_confirmation" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" :class="{ 'is-invalid': errors.password_confirmation }"
                        id="password_confirmation" v-model="form.password_confirmation">
                    <div v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation }}</div>
                </div>

                <button type="submit" class="btn btn-primary">Register</button>
            </form>
            <div v-else>
                <span>Go to Login Page</span> <router-link to="/login" class="btn btn-primary">Login</router-link>
            </div>
        </div>
        <AppLoader v-if="isLoading" />
    </PageLayout>
</template>

<style></style>
