import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { Role } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, user, hasAnyRole, hasHydrated } = useAuth();

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Si se especificaron roles permitidos, verificar
  if (allowedRoles && allowedRoles.length > 0) {
    if (!hasAnyRole(allowedRoles)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
