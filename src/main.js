import axios from 'axios';
import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/routes';

// Axios configuration
const axiosInstance = axios.create({
    withCredentials: true
});
axiosInstance.interceptors.request.use(req => {
    req.headers = req.headers || {};
    req.headers.common = req.headers.common || {};
    req.headers.common['Accept'] = 'application/json';
    req.headers.common['Content-Type'] = 'application/json';
    return req;
});

axiosInstance.interceptors.response.use(
    res => res,
    err => {
        if (err.response.status === 401 && err.response.data.message !== 'login-failed') {
            localStorage.removeItem('user');
            window.location.reload();
        }

        Promise.reject(err);
    }
);

const app = createApp(App);

// Global instance
app.config.globalProperties.$axios = axiosInstance;

app.use(router);
app.mount('#app');
