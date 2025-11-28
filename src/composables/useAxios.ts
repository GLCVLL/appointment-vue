import { getCurrentInstance } from 'vue';
import type { AxiosInstance } from 'axios';

export function useAxios(): AxiosInstance {
    const instance = getCurrentInstance();
    if (!instance) {
        throw new Error('useAxios must be called within a component setup function');
    }
    return instance.appContext.config.globalProperties.$axios;
}

