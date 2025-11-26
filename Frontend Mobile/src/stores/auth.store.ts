import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Role } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    loadAuthData: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;

    // Helpers
    isTechnician: () => boolean;
    isAdmin: () => boolean;
    hasRole: (role: Role) => boolean;
}

const TOKEN_KEY = '@aura_token';
const USER_KEY = '@aura_user';

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setToken: (token) => set({ token }),

    login: async (user, token) => {
        try {
            await Promise.all([
                SecureStore.setItemAsync(TOKEN_KEY, token),
                AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
            ]);
            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            console.error('Error saving auth data:', error);
        }
    },

    logout: async () => {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY)
            ]);
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        } catch (error) {
            console.error('Error clearing auth data:', error);
        }
    },

    loadAuthData: async () => {
        try {
            const [token, userData] = await Promise.all([
                SecureStore.getItemAsync(TOKEN_KEY),
                AsyncStorage.getItem(USER_KEY)
            ]);

            if (token && userData) {
                const user = JSON.parse(userData);
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading auth data:', error);
            set({ isLoading: false });
        }
    },

    updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser });
            AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        }
    },

    isTechnician: () => {
        const user = get().user;
        return user?.role === Role.TECHNICIAN;
    },

    isAdmin: () => {
        const user = get().user;
        return user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;
    },

    hasRole: (role: Role) => {
        const user = get().user;
        return user?.role === role;
    },
}));
