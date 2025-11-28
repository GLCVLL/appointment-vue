/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';
import { Router } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $router: Router;
  }
}

