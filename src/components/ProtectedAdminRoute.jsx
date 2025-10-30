import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is admin using their UUID (more secure than email)
  const isAdmin = user?.id === import.meta.env.VITE_SUPABASE_ADMIN_ID;

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
      
      // Show toast if user is not admin
      if (user && !isAdmin) {
        toast({
          title: 'Acceso Denegado',
          description: 'No tienes permisos para acceder al panel de administración',
          variant: 'destructive',
        });
      }
    }
  }, [loading, user, isAdmin]);

  // Show loading state while checking authentication
  if (loading || isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: '1.125rem',
        color: 'hsl(0, 0%, 70%)'
      }}>
        Verificando permisos...
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace state={{ fromInternal: true }} />;
  }

  // User is admin, render the protected content
  return children;
};
