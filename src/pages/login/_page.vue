<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { setUser } from "@/store/auth";
import { login } from "@/composables/useApi";
import PageLayout from "@/components/PageLayout.vue";
import Card from "@/components/Card.vue";
import Button from "@/components/Button.vue";
import AppLoader from "@/components/AppLoader.vue";
import { useNavigation } from "@/composables/useNavigation";
import type { LoginRequest } from "@/types/api";
import z from "zod";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  email?: string;
  password?: string;
  generic?: string;
}

// ZOD SCHEMA
const schema = z.object({
  email: z.email("Email non valida"),
  password: z.string("Password non valida"),
});

// DATA
const { authLinks } = useNavigation();
const router = useRouter();

const form = ref<FormData>({
  email: "",
  password: "",
});

const errors = ref<Errors>({});

// MUTATION
const mLogin = useMutation({
  mutationFn: (payload: LoginRequest) => login(payload),
  onSuccess: (data) => {
    localStorage.user = JSON.stringify(data);
    setUser(data);
    router.push("/");
  },
  onError: () => {
    errors.value = { generic: "Credentials are not valid" };
  },
});

// Computed per gestire il loader di tutta la pagina
const isPageLoading = computed((): boolean => {
  return mLogin.isPending.value;
});

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

  mLogin.mutate({
    email: form.value.email,
    password: form.value.password,
  });
};
</script>

<template>
  <PageLayout :links="authLinks">
    <AppLoader v-if="isPageLoading" />
    <div class="flex justify-center items-center flex-1">
      <div class="w-full max-w-md">
        <Card title="Login" class="m-4">
          <form @submit.prevent="" novalidate class="flex flex-col gap-4">
            <div v-if="errors.generic" class="alert alert-danger">
              {{ errors.generic }}
            </div>

            <div class="flex flex-col gap-2">
              <label for="email" class="text-sm">Email</label>
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
              <label for="password" class="text-sm">Password</label>
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

            <Button
              label="Login"
              theme="primary"
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
