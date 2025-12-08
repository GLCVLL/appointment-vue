<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { setUser, User } from "@/store/auth";
import { useAxios } from "@/composables/useAxios";
import PageLayout from "@/components/PageLayout.vue";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";

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
  email: "",
  password: "",
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
  if (!form.value.email)
    validationErrors.email = "The email field is mandatory";
  if (!form.value.password)
    validationErrors.password = "The password field is mandatory";

  errors.value = validationErrors;
};

const login = async (): Promise<void> => {
  const apiUrl = import.meta.env.VITE_BASEURI as string;
  try {
    await axios.get(apiUrl + "/sanctum/csrf-cookie");
    const { data } = await axios.post<User>(apiUrl + "/api/login", form.value);

    localStorage.user = JSON.stringify(data);
    setUser(data);
    router.push("/");
  } catch (e) {
    errors.value = { generic: "Credentials are not valid" };
  }
};
</script>

<template>
  <PageLayout>
    <div class="flex justify-center items-center flex-1">
      <div class="w-full max-w-md">
        <Card title="Login" class="m-4">
          <form @submit.prevent="" novalidate class="flex flex-col gap-4">
            <div v-if="errors.generic" class="alert alert-danger">
              {{ errors.generic }}
            </div>

            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">Email address</label>
              <input
                type="email"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.email }"
                id="email"
                v-model.trim="form.email"
              />
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm">Password</label>
              <input
                type="password"
                class="bg-white p-2 rounded-md"
                :class="{ 'is-invalid': errors.password }"
                id="password"
                v-model.trim="form.password"
              />
              <div v-if="errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>

            <Button
              label="Login"
              theme="contrast"
              icon="login"
              @click="submitForm"
            />

            <!-- Register Page -->
            <div class="mt-3 flex items-center gap-2 text-sm">
              <span>Non hai un account?</span>
              <RouterLink
                to="/register"
                class="text-primary-600 hover:text-primary-800"
                >Registrati ora</RouterLink
              >
            </div>
          </form>
        </Card>
      </div>
    </div>
  </PageLayout>
</template>

<style></style>
