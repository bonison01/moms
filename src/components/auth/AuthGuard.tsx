
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

/**
 * Authentication guard component
 * Protects routes based on authentication status and user role
 * 
 * @param children - Components to render if authenticated and authorized
 * @param requireAdmin - Whether admin role is required (default: false)
 * @param fallback - Component to render if not authorized (default: loading spinner)
 */
const AuthGuard = ({ children, requireAdmin = false, fallback }: AuthGuardProps) => {
  const { loading, profileLoading, isAuthenticated, isAdmin } = useAuth();

  console.log('🛡️ AuthGuard check:', {
    loading,
    profileLoading,
    isAuthenticated,
    isAdmin,
    requireAdmin
  });

  // Show loading while checking authentication
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-sm">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('❌ User not authenticated');
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    console.log('❌ Admin access required but user is not admin');
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }

  console.log('✅ Authentication check passed, rendering children');
  return <>{children}</>;
};

export default AuthGuard;
