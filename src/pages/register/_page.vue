<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";
import { useNavigation } from "@/composables/useNavigation";

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
}

interface Errors {
  [key: string]: string | undefined;
}

// DATA
const { authLinks } = useNavigation();
const router = useRouter();
const axios = useAxios();

const form = ref<FormData>({
  name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
});

const isLoading = ref(false);
const isUserCreated = ref(false);
const errors = ref<Errors>({});

const formHasErrors = computed((): boolean => {
  return Object.keys(errors.value).length > 0;
});

// HANDLERS
const submitForm = (): void => {
  errors.value = {};
  validateForm();
  if (!formHasErrors.value) {
    register();
  }
};

const validateForm = (): void => {
  // Validates form data
  const validationErrors: Errors = {};
  // Validation rules
  if (!form.value.name) validationErrors.name = "The name field is mandatory";
  if (!form.value.email)
    validationErrors.email = "The email field is mandatory";
  else if (
    !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(form.value.email)
  )
    validationErrors.email = "Please insert a valid email";
  if (!form.value.phone_number)
    validationErrors.phone_number = "The phone number field is mandatory";
  else if (
    !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
      form.value.phone_number
    )
  )
    validationErrors.phone_number = "Please insert a valid phone number";
  if (!form.value.password)
    validationErrors.password = "The password field is mandatory";
  else if (form.value.password.length < 5)
    validationErrors.password = "The password must be at least 5 characters";
  if (form.value.password !== form.value.password_confirmation)
    validationErrors.password_confirmation =
      "The password confirmation does not match";

  errors.value = validationErrors; // Set component errors to temporary errors
};

const register = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  isLoading.value = true;

  try {
    await axios.get(apiUrl + "/sanctum/csrf-cookie");
    await axios.post(`${apiUrl}/api/register`, form.value);
    isUserCreated.value = true;
  } catch (err: unknown) {
    const axiosError = err as {
      response?: {
        status?: number;
        data?: { errors?: Record<string, string[]>; appErrors?: string };
      };
    };
    if (axiosError.response && axiosError.response.status === 422) {
      const { errors: responseErrors, appErrors } =
        axiosError.response.data || {};

      const errorMessages: Errors = {};
      if (responseErrors) {
        for (const field in responseErrors) {
          errorMessages[field] = responseErrors[field][0];
        }
      }
      errors.value = { ...errorMessages };

      if (appErrors) {
        errors.value.generic = appErrors;
      }
    } else {
      errors.value.generic = "Something went wrong";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <PageLayout :links="authLinks">
    <div class="flex justify-center items-center flex-1">
      <div class="w-full max-w-md">
        <Card v-if="!isUserCreated" title="Register" class="m-4">
          <form
            @submit.prevent="submitForm"
            novalidate
            class="flex flex-col gap-4"
          >
            <div v-if="errors.generic" class="alert alert-danger">
              {{ errors.generic }}
            </div>

            <div class="flex flex-col gap-2">
              <label for="name" class="text-sm">
                Name <span class="text-red-600">*</span>
              </label>
              <input
                type="text"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.name }"
                id="name"
                v-model.trim="form.name"
              />
              <div v-if="errors.name" class="text-red-600 text-xs mt-1">
                {{ errors.name }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">
                Email address <span class="text-red-600">*</span>
              </label>
              <input
                type="email"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.email }"
                id="email"
                v-model.trim="form.email"
              />
              <div v-if="errors.email" class="text-red-600 text-xs mt-1">
                {{ errors.email }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="phone_number" class="text-sm">
                Phone number <span class="text-red-600">*</span>
              </label>
              <input
                type="tel"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.phone_number }"
                id="phone_number"
                v-model.trim="form.phone_number"
              />
              <div v-if="errors.phone_number" class="text-red-600 text-xs mt-1">
                {{ errors.phone_number }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm">
                Password <span class="text-red-600">*</span>
              </label>
              <input
                type="password"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.password }"
                id="password"
                v-model.trim="form.password"
              />
              <div v-if="errors.password" class="text-red-600 text-xs mt-1">
                {{ errors.password }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password_confirmation" class="text-sm">
                Confirm Password <span class="text-red-600">*</span>
              </label>
              <input
                type="password"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.password_confirmation }"
                id="password_confirmation"
                v-model.trim="form.password_confirmation"
              />
              <div
                v-if="errors.password_confirmation"
                class="text-red-600 text-xs mt-1"
              >
                {{ errors.password_confirmation }}
              </div>
            </div>

            <Button
              label="Register"
              theme="contrast"
              icon="user"
              @click="submitForm"
            />

            <!-- Login Page -->
            <div class="mt-3 flex items-center gap-2 text-sm">
              <span>Hai già un account?</span>
              <RouterLink
                to="/login"
                class="text-primary-600 hover:text-primary-800"
                >Accedi ora</RouterLink
              >
            </div>
          </form>
        </Card>

        <Card v-else title="Registrazione completata" class="m-4">
          <div class="flex flex-col gap-4">
            <div class="alert alert-success">Utente creato con successo!</div>
            <div class="mt-3 flex items-center gap-2 text-sm">
              <span>Ora puoi accedere al tuo account</span>
            </div>
            <Button
              label="Vai al Login"
              theme="contrast"
              icon="login"
              @click="router.push('/login')"
            />
          </div>
        </Card>
      </div>
    </div>
  </PageLayout>
</template>

<style></style>
