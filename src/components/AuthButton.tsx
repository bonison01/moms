
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, User, Shield } from 'lucide-react';

/**
 * Authentication button component
 * Shows different states based on user authentication status
 */
const AuthButton = () => {
  const { isAuthenticated, isAdmin, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Don't show anything while loading
  if (loading) {
    return null;
  }

  // If authenticated, show user info and dashboard link
  if (isAuthenticated) {
    const dashboardPath = isAdmin ? '/admin' : '/customer-dashboard';
    const buttonText = isAdmin ? 'Admin Panel' : 'My Account';
    const icon = isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;

    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate(dashboardPath)}
          className="flex items-center space-x-2"
        >
          {icon}
          <span>{buttonText}</span>
        </Button>
        <span className="text-sm text-gray-600 hidden md:block">
          Welcome, {profile?.full_name || 'User'}
        </span>
      </div>
    );
  }

  // If not authenticated, show login button
  return (
    <Button
      onClick={() => navigate('/auth')}
      className="flex items-center space-x-2"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </Button>
  );
};

export default AuthButton;
