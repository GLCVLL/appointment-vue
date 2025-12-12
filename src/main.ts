import { createApp } from "vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";
import App from "@/App.vue";
import router from "@/routes/routes";
import "@/assets/css/style.css";

const app = createApp(App);

app.use(router);
app.use(ToastService);
app.use(ConfirmationService);

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
      darkModeSelector: "none", // Disabilita il dark mode automatico
      cssLayer: {
        name: "primevue",
        order: "theme, base, primevue",
      },
    },
  },
});

app.mount("#app");
