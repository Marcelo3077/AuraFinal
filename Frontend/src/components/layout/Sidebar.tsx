import { Link, useLocation } from 'react-router-dom';
import { DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Wrench, 
  CreditCard, 
  Star, 
  MessageSquare, 
  Settings,
  Users,
  BarChart,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks';
import { Role } from '@/types';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
  excludeRoles?: Role[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user, hasAnyRole, isTechnician } = useAuth();
  
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'Services',
      href: '/services',
      icon: Wrench,
      excludeRoles: [Role.TECHNICIAN],
    },
    {
      title: isTechnician ? 'Job Requests' : 'My Reservations',
      href: '/reservations',
      icon: Calendar,
    },
    {
      title: 'My Services',
      href: '/my-services',
      icon: Wrench,
      roles: [Role.TECHNICIAN],
    },
    {
      title: 'Payments',
      href: '/payments',
      icon: CreditCard,
      excludeRoles: [Role.TECHNICIAN], // Técnicos no ven payments
    },
    {
      title: 'Reviews',
      href: '/reviews',
      icon: Star,
    },
    {
    title: 'Earnings',
    href: '/earnings',
    icon: DollarSign,
    roles: [Role.TECHNICIAN],
    },
    {
      title: 'Support',
      href: '/support',
      icon: MessageSquare,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      title: 'Technicians',
      href: '/admin/technicians',
      icon: Users,
      roles: [Role.ADMIN, Role.SUPERADMIN],
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart,
      roles: [Role.ADMIN, Role.SUPERADMIN],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    // Excluir si está en excludeRoles
    if (item.excludeRoles && user?.role && item.excludeRoles.includes(user.role as Role)) {
      return false;
    }
    
    // Si tiene roles específicos, verificar
    if (item.roles && item.roles.length > 0) {
      return hasAnyRole(item.roles);
    }
    
    return true;
  });
  
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="flex-1 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        
        <div className="border-t pt-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium">
              {isTechnician ? 'Professional Support' : 'Need Help?'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {isTechnician 
                ? 'Get assistance with your jobs'
                : 'Contact our support team 24/7'
              }
            </p>
            <Link
              to="/support"
              className="mt-2 inline-flex text-xs text-primary hover:underline"
            >
              Get Support →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
