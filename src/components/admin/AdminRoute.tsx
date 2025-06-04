
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile, loading, profileLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect when we have complete auth information
    if (!loading && !profileLoading) {
      if (!user) {
        console.log('No user - redirecting to admin login');
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!profile) {
        console.log('No profile found - redirecting to admin login');
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!isAdmin) {
        console.log('User is not admin - redirecting to admin login');
        navigate('/admin/login', { replace: true });
        return;
      }
    }
  }, [user, profile, loading, profileLoading, isAdmin, navigate]);

  // Show loading while checking auth
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not properly authenticated and authorized
  if (!user || !profile || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute;
