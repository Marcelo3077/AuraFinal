import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  restricted = false 
}) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated && restricted) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
