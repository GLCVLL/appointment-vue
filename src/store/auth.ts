import { reactive } from 'vue';

export interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: unknown;
}

interface AuthState {
    user: User | null;
}

// Initial state
const state = reactive<AuthState>({
    user: localStorage.user ? JSON.parse(localStorage.user) : null
});

// # Getter
export const isLogged = (): boolean => state.user !== null;
export const getUser = (): User | null => state.user;

// # Setter
export const setUser = (user: User): void => { 
    state.user = user; 
};
export const removeUser = (): void => { 
    state.user = null; 
};

export default (): AuthState => ({ ...state });

