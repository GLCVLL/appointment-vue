<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { setUser, User } from '@/store/auth';
import { useAxios } from '@/composables/useAxios';

interface FormData {
    email: string;
    password: string;
}

interface Errors {
    email?: string;
    password?: string;
    generic?: string;
}

const router = useRouter();
const axios = useAxios();

const form = ref<FormData>({
    email: '',
    password: '',
});

const errors = ref<Errors>({});

const formHasErrors = computed((): boolean => {
    return Object.keys(errors.value).length > 0;
});

const submitForm = (): void => {
    errors.value = {};
    validateForm();
    if (!formHasErrors.value) {
        login();
    }
};

const validateForm = (): void => {
    const validationErrors: Errors = {};
    if (!form.value.email) validationErrors.email = 'The email field is mandatory';
    if (!form.value.password) validationErrors.password = 'The password field is mandatory';

    errors.value = validationErrors;
};

const login = async (): Promise<void> => {
    const apiUrl = import.meta.env.VITE_BASEURI as string;
    try {
        await axios.get(apiUrl + '/sanctum/csrf-cookie');
        const { data } = await axios.post<User>(apiUrl + '/api/login', form.value);

        localStorage.user = JSON.stringify(data);
        setUser(data);
        router.push('/');
    } catch (e) {
        errors.value = { generic: 'Credentials are not valid' };
    }
};
</script>

<template>
    <div class="container">
        <h1>Login Page</h1>

        <div v-if="errors.generic" class="alert alert-danger">
            {{ errors.generic }}
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
