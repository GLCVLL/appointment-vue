import {isLogged} from '../../../store/auth';

// if you are logged

export default (to, from, next) => {
    if (isLogged()) next();
    else next({name: 'login'});
}