import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] transition-all duration-300 pt-4',
          sidebarOpen ? 'ml-64' : 'ml-0'
        )}
      >
        <div className="container pb-8">
          <Outlet />
        </div>
      </main>
      
      <Toaster position="top-right" richColors />
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
