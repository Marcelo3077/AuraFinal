import { useAuthStore } from '@/stores/auth.store';
import { Role } from '@/types';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    setUser,
    clearError,
    checkAuth,
    hasHydrated,
  } = useAuthStore();

  const hasRole = (role: Role): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: Role[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role as Role);
  };

  const isUser = user?.role === Role.USER;

  const isTechnician = user?.role === Role.TECHNICIAN;

  const isAdmin = user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    hasRole,
    hasAnyRole,
    isUser,
    isTechnician,
    isAdmin,
    login,
    logout,
    setUser,
    register,
    clearError,
    hasHydrated,
  };
};
