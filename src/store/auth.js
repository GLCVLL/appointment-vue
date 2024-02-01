import { reactive } from 'vue';

// Initial state
const state = reactive({
    user: localStorage.user ? JSON.parse(localStorage.user) : null
});

// # Getter
export const isLogged = () => state.user !== null;

// # Setter
export const setUser = user => { state.user = user; };
export const removeUser = () => { state.user = null; };

export default () => ({ ...state });