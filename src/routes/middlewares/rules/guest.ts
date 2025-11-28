import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { isLogged } from '@/store/auth';

// if you are logged

export default (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext): void => {
    if (isLogged()) next({ name: 'home' });
    else next();
};

