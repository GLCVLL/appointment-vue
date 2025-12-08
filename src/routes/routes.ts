import auth from "@/routes/middlewares/auth";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// Routes
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/pages/_page.vue"),
    name: "home",
  },
  {
    path: "/dashboard",
    component: () => import("@/pages/dashboard/_page.vue"),
    name: "dashboard",
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
  {
    path: "/privacy-policy",
    component: () => import("@/pages/privacyPolicy/_page.vue"),
    name: "privacyPolicy",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
  },
});

export default router;
