import { createRouter, createWebHistory } from 'vue-router';

// pages
import HomePage from '../pages/HomePage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import AppoitmentPage from '../pages/AppointmentPage.vue';


// middleware
import auth from '../routes/middlewares/auth';

// Routes
const routes = [
    { path: '/', component: HomePage, name: 'home', beforeEnter: auth.user },
    { path: '/register', component: RegisterPage, name: 'register', beforeEnter: auth.guest },
    { path: '/login', component: LoginPage, name: 'login', beforeEnter: auth.guest },
    { path: '/appointments', component: AppoitmentPage, name: 'appointments', beforeEnter: auth.user},

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;