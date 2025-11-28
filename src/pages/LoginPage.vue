<script>
import { setUser } from '@/store/auth';


export default {
    name: 'LoginPage',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            errors: {

            },
        };
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
                this.login();
            }
        },
        validateForm() {
            const errors = {};
            if (!this.form.email) errors.email = 'The email field is mandatory';
            if (!this.form.password) errors.password = 'The password field is mandatory';

            this.errors = errors;
        },
        async login() {
            const apiUrl = import.meta.env.VITE_BASEURI;
            try {
                await this.$axios.get(apiUrl + '/sanctum/csrf-cookie');
                const { data } = await this.$axios.post(apiUrl + '/api/login', this.form);

                localStorage.user = JSON.stringify(data);
                setUser(data);
                this.$router.push('/');
            } catch (e) {
                this.errors = { generic: 'Credentials are not valid' };
            }
        }
    }
}

</script>

<template>
    <div class="container">
        <h1>Login Page</h1>

        <div v-if="errors.generic" class="alert alert-danger">
            {{ this.errors.generic }}
        </div>
        <section>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="email"
                    v-model.trim="form.email">
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" :class="{ 'is-invalid': errors.password }" id="password"
                    v-model.trim="form.password">
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
            </div>
            <button type="button" class="btn btn-primary" @click="submitForm">Login</button>
            <!-- Register Page -->
            <div class="mt-3">
                <span>Not registered yet?</span> <router-link to="/register" class="btn btn-secondary">Register
                    Now</router-link>
            </div>
        </section>
    </div>
</template>

<style></style>