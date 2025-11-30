/// <reference types="vite/client" />

import { AxiosInstance } from 'axios';
import { Router } from 'vue-router';

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $router: Router;
  }
}

