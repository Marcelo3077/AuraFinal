import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Technician, Admin, Role, LoginResponse, RegisterUserRequest } from '../types';
import { AuthService } from '../api';
import { setTokens, clearTokens } from '../api/axios.config';

type RegisterPayload = Omit<RegisterUserRequest, 'role'>;

type AuthUser = User | Technician | Admin;

const normalizeRole = (role?: Role | string): Role | undefined => {
  if (!role) return undefined;

  const cleanedRole = typeof role === 'string' ? role.replace(/^ROLE_/, '') : role;

  return (Object.values(Role) as string[]).includes(cleanedRole as string)
    ? (cleanedRole as Role)
    : undefined;
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterPayload, role: Role) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: true,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await AuthService.login({ email, password });
          const authUser: AuthUser = {
            id: response.userId,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: normalizeRole(response.role) ?? response.role,
            phone: response.phone || '',
            isActive: true,
            createdAt: new Date().toISOString(),
          };

          setTokens(response.token, response.refreshToken);
          set({
            user: authUser,
            isAuthenticated: true,
            isLoading: false,
            hasHydrated: true,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await AuthService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            hasHydrated: true,
          });
        }
      },
      
      register: async (data: RegisterPayload, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          const payload: RegisterUserRequest = { ...data, role };
          const response: LoginResponse = await AuthService.register(payload);
          const authUser: AuthUser = {
            id: response.userId,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: normalizeRole(response.role) ?? response.role,
            phone: response.phone || '',
            isActive: true,
            createdAt: new Date().toISOString(),
          };

          setTokens(response.token, response.refreshToken);
          set({
            user: authUser,
            isAuthenticated: true,
            isLoading: false,
            hasHydrated: true,
          });
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },
      
      setUser: (user: AuthUser | null) => {
        set({
          user,
          isAuthenticated: !!user,
          hasHydrated: true,
          isLoading: false,
        });
      },
      
      clearError: () => set({ error: null }),
      
      checkAuth: () => {
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true, hasHydrated: true });
        } else {
          set({ hasHydrated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AuthState>;
        const storedUser = state.user as AuthUser | null | undefined;
        const normalizedRole = normalizeRole(storedUser?.role);

        const user = storedUser
          ? {
              ...storedUser,
              role: normalizedRole ?? storedUser.role,
            }
          : null;

        return {
          ...state,
          user,
          isAuthenticated: !!user,
        } as AuthState;
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

useAuthStore.persist.onFinishHydration((state) => {
  const storedUser = (state as AuthState | undefined)?.user;
  useAuthStore.setState({
    hasHydrated: true,
    isAuthenticated: !!storedUser,
    isLoading: false,
  });
});
