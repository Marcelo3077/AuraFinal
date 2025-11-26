import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { TechnicianEarningsPage } from './pages/earnings/TechnicianEarningsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TechnicianDashboardPage } from './pages/dashboard/TechnicianDashboardPage';

// Services
import { ServicesPage } from './pages/services/ServicesPage';
import { ServiceDetailPage } from './pages/services/ServiceDetailPage';
import { TechnicianServicesPage } from './pages/services/TechnicianServicesPage';
import { TechnicianDetailPage } from './pages/technicians/TechnicianDetailPage';

// Reservations
import { ReservationsPage } from './pages/reservations/ReservationsPage';
import { TechnicianReservationsPage } from './pages/reservations/TechnicianReservationsPage';
import { CreateReservationPage } from './pages/reservations/CreateReservationPage';

// Profile
import { ProfilePage } from './pages/profile/ProfilePage';
import { TechnicianProfilePage } from './pages/profile/TechnicianProfilePage';

// Payments
import { PaymentsPage } from './pages/payments/PaymentsPage';

// Reviews
import { ReviewsPage } from './pages/reviews/ReviewsPage';

// Support
import { SupportPage } from './pages/support/SupportPage';

// Settings
import { SettingsPage } from './pages/settings/SettingsPage';

// Role
import { Role } from './types';
import { useAuth } from './hooks';

// Component to render correct dashboard based on role
const DashboardRouter = () => {
  const { isTechnician } = useAuth();
  
  if (isTechnician) {
    return <TechnicianDashboardPage />;
  }
  
  return <DashboardPage />;
};

// Component to render correct profile based on role
const ProfileRouter = () => {
  const { isTechnician } = useAuth();
  
  if (isTechnician) {
    return <TechnicianProfilePage />;
  }
  
  return <ProfilePage />;
};

// Component to render correct reservations based on role
const ReservationsRouter = () => {
  const { isTechnician } = useAuth();
  
  if (isTechnician) {
    return <TechnicianReservationsPage />;
  }
  
  return <ReservationsPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute restricted>
            <LoginPage />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute restricted>
            <RegisterPage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path="/earnings" element={
            <PrivateRoute allowedRoles={[Role.TECHNICIAN]}>
              <TechnicianEarningsPage />
            </PrivateRoute>
          } />

          {/* Dashboard - Dynamic based on role */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          {/* Services */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/technicians/:id" element={<TechnicianDetailPage />} />
          <Route
            path="/my-services"
            element={
              <PrivateRoute allowedRoles={[Role.TECHNICIAN]}>
                <TechnicianServicesPage />
              </PrivateRoute>
            }
          />
          
          {/* Reservations - Dynamic based on role */}
          <Route path="/reservations" element={<ReservationsRouter />} />
          <Route path="/reservations/create" element={
            <PrivateRoute allowedRoles={[Role.USER]}>
              <CreateReservationPage />
            </PrivateRoute>
          } />
          
          {/* Payments - Only for users */}
          <Route path="/payments" element={
            <PrivateRoute allowedRoles={[Role.USER]}>
              <PaymentsPage />
            </PrivateRoute>
          } />
          
          {/* Reviews */}
          <Route path="/reviews" element={<ReviewsPage />} />
          
          {/* Support */}
          <Route path="/support" element={<SupportPage />} />
          
          {/* Profile - Dynamic based on role */}
          <Route path="/profile" element={<ProfileRouter />} />
          
          {/* Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <PrivateRoute allowedRoles={[Role.ADMIN, Role.SUPERADMIN]}>
              <div>Admin Panel (To be implemented)</div>
            </PrivateRoute>
          } />
        </Route>
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
