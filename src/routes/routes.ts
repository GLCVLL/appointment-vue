import auth from "@/routes/middlewares/auth";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Routes
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/_page.vue"),
    name: "home",
    beforeEnter: auth.user,
  },
  {
    path: "/register",
    component: () => import("@/pages/register/_page.vue"),
    name: "register",
    beforeEnter: auth.guest,
  },
  {
    path: "/login",
    component: () => import("@/pages/login/_page.vue"),
    name: "login",
    beforeEnter: auth.guest,
  },
  {
    path: "/appointments",
    component: () => import("@/pages/appointments/_page.vue"),
    name: "appointments",
    beforeEnter: auth.user,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
