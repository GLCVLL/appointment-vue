import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import user from '@/routes/middlewares/rules/user';
import guest from '@/routes/middlewares/rules/guest';

interface AuthMiddlewares {
    user: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => void;
    guest: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => void;
}

const auth: AuthMiddlewares = { user, guest };

export default auth;

