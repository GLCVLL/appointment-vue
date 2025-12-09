import { getCurrentInstance } from 'vue';
import type { AxiosInstance } from 'axios';

export function useApi(): AxiosInstance {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useApi must be called within a component setup function');
    }
    return instance.appContext.config.globalProperties.$axios;
}

