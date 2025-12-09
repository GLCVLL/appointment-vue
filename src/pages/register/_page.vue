<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/useApi";
import PageLayout from "@/components/PageLayout.vue";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";
import { useNavigation } from "@/composables/useNavigation";
import z from "zod";

interface FormData {
  first_name: string;
  last_name: string;
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
const axios = useApi();

const schema = z
  .object({
    first_name: z.string().min(1, "Il campo nome è obbligatorio"),
    last_name: z.string().min(1, "Il campo cognome è obbligatorio"),
    email: z.email("Email non valida").min(1, "Il campo email è obbligatorio"),
    phone_number: z
      .string()
      .min(1, "Il campo numero di telefono è obbligatorio")
      .regex(
        /^\+?[0-9]{8,15}$/,
        "Inserisci un numero di telefono valido (solo cifre, opzionalmente con + all'inizio)"
      ),
    password: z
      .string()
      .min(5, "La password deve essere di almeno 5 caratteri"),
    password_confirmation: z
      .string()
      .min(1, "Il campo conferma password è obbligatorio"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "La conferma della password non corrisponde",
  });

const form = ref<FormData>({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  password_confirmation: "",
});

const isLoading = ref(false);
const isUserCreated = ref(false);
const errors = ref<Errors>({});

// HANDLERS
const submitForm = (): void => {
  errors.value = {};

  // Validate form data
  const result = schema.safeParse(form.value);

  if (!result.success) {
    const treeErrors = z.treeifyError(result.error);

    if (treeErrors.properties) {
      errors.value = Object.fromEntries(
        Object.entries(treeErrors.properties).map(([key, value]) => [
          key,
          value.errors[0],
        ])
      );
    }
    return;
  }

  register();
};

const register = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  isLoading.value = true;

  try {
    await axios.get(apiUrl + "/sanctum/csrf-cookie");
    // Concatenate first_name and last_name with a space for the backend
    const { first_name, last_name, ...rest } = form.value;
    const payload = {
      ...rest,
      name: `${first_name} ${last_name}`.trim(),
    };
    await axios.post(`${apiUrl}/api/register`, payload);
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
      errors.value.generic = "Qualcosa è andato storto";
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
        <Card v-if="!isUserCreated" title="Registrazione" class="m-4">
          <form
            @submit.prevent="submitForm"
            novalidate
            class="flex flex-col gap-4"
          >
            <div v-if="errors.generic" class="alert alert-danger">
              {{ errors.generic }}
            </div>

            <div class="flex flex-col gap-2">
              <label for="first_name" class="text-sm">
                Nome <span class="text-red-600">*</span>
              </label>
              <input
                type="text"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.first_name }"
                id="first_name"
                v-model.trim="form.first_name"
              />
              <div v-if="errors.first_name" class="text-red-600 text-xs mt-1">
                {{ errors.first_name }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="last_name" class="text-sm">
                Cognome <span class="text-red-600">*</span>
              </label>
              <input
                type="text"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.last_name }"
                id="last_name"
                v-model.trim="form.last_name"
              />
              <div v-if="errors.last_name" class="text-red-600 text-xs mt-1">
                {{ errors.last_name }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">
                Indirizzo email <span class="text-red-600">*</span>
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
                Numero di telefono <span class="text-red-600">*</span>
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
                Conferma password <span class="text-red-600">*</span>
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
              label="Registrati"
              theme="primary"
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
              theme="primary"
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
