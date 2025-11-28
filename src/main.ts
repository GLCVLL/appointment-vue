import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import App from "@/App.vue";
import router from "@/routes/routes";
import "@/assets/css/style.css";

// Axios configuration
const axiosInstance = axios.create({
  withCredentials: true,
  withXSRFToken: true,
});

axiosInstance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  req.headers = req.headers || {};
  req.headers.common = req.headers.common || {};
  req.headers.common["Accept"] = "application/json";
  req.headers.common["Content-Type"] = "application/json";
  return req;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (
      err.response &&
      err.response.status === 401 &&
      err.response.data &&
      (err.response.data as { message?: string }).message !== "login-failed"
    ) {
      localStorage.removeItem("user");
      window.location.reload();
    }

    return Promise.reject(err);
  }
);

const app = createApp(App);

// Global instance
app.config.globalProperties.$axios = axiosInstance;

app.use(router);

// Custom preset with pink primary color
const PinkPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{rose.50}",
      100: "{rose.100}",
      200: "{rose.200}",
      300: "{rose.300}",
      400: "{rose.400}",
      500: "{rose.500}",
      600: "{rose.600}",
      700: "{rose.700}",
      800: "{rose.800}",
      900: "{rose.900}",
      950: "{rose.950}",
    },
  },
});

app.use(PrimeVue, {
  theme: {
    preset: PinkPreset,
    options: {
      cssLayer: {
        name: "primevue",
        order: "theme, base, primevue",
      },
    },
  },
});

app.mount("#app");
