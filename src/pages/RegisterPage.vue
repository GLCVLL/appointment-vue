<script>
import AppAlert from '../components/AppAlert.vue';
import AppLoader from '../components/AppLoader.vue';
export default {
    name: 'RegisterPage',
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
            },
            isLoading: false,
            alert: {
                isVisible: false,
                type: 'success',
                message: '',
            },
            isUserCreated: false,
            errors: {},
        };
    },
    components: {
        AppLoader, AppAlert,
    },
    computed: {
        formHasErrors() {
            return Object.keys(this.errors).length;
        }
    },
    methods: {
        submitForm() {
            this.errors = {};
            this.validateForm();
            if (!this.formHasErrors) {
                this.register();
            }
        },
        validateForm() {
            const errors = {};
            if (!this.form.name) errors.name = 'The name field is mandatory';
            if (!this.form.email) errors.email = 'The email field is mandatory';
            else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.form.email)) errors.email = 'Please insert a valid email';
            if (!this.form.password) errors.password = 'The password field is mandatory';
            else if (this.form.password.length < 5) errors.password = 'The password must be at least 5 characters';
            if (this.form.password !== this.form.password_confirmation) errors.password_confirmation = 'The password confirmation does not match';

            this.errors = errors;
        },
        async register() {
            const apiUrl = import.meta.env.VITE_BASEURI;
            this.isLoading = true;

            this.alert = {
                isVisible: false,
                type: 'success',
                message: '',
            };
            try {
                await this.$axios.get(apiUrl + '/sanctum/csrf-cookie');
                await this.$axios.post(`${apiUrl}/api/register`, this.form);
                this.alert = {
                    isVisible: true,
                    type: 'success',
                    message: 'User successfully created',
                };

                this.isUserCreated = true;

            } catch (err) {
                if (err.response && err.response.status === 422) {
                    // Get Errors
                    const { errors, appErrors } = err.response.data;

                    // Reset Messages
                    const errorMessages = {};

                    // Set Error Messages
                    for (let field in errors) errorMessages[field] = errors[field][0];
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
                    this.errors = { network: 'Something went wrong' }
                    this.alert = {
                        isVisible: true,
                        type: 'danger',
                        message: 'Something went wrong',
                    };
                }
            } finally {
                this.isLoading = false;
            }
        }

    },
};
</script>

<template>
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
</template>

<style></style>