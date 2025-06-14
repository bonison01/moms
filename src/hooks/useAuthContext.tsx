import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * User profile interface matching our database schema
 */
export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  // Address fields
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  phone: string | null;
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  
  // Loading states
  loading: boolean;
  profileLoading: boolean;
  
  // Computed properties
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  
  // Utility methods
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to use authentication context
 * Throws error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication provider component
 * Manages all authentication state and provides it to child components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  /**
   * Fetches user profile from database
   * Uses security definer function to avoid RLS issues
   */
  const fetchProfile = async (userId: string): Promise<void> => {
    try {
      setProfileLoading(true);
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Exception fetching profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Refresh profile data
   */
  const refreshProfile = async (): Promise<void> => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  /**
   * Initialize authentication state
   * Sets up auth listener and gets initial session
   */
  useEffect(() => {
    let mounted = true;
    console.log('🔧 Initializing authentication system');

    /**
     * Handle auth state changes
     * CRITICAL: Keep this function synchronous to prevent deadlocks
     */
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');

      // Update session and user state immediately (synchronous)
      setSession(session);
      setUser(session?.user ?? null);

      // Handle profile fetching asynchronously
      if (session?.user) {
        // Use setTimeout to defer async operations and prevent deadlocks
        setTimeout(() => {
          if (mounted) {
            fetchProfile(session.user.id);
          }
        }, 0);
      } else {
        // Clear profile if no user
        setProfile(null);
        setProfileLoading(false);
      }

      // Auth initialization complete
      setLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🚀 Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Error getting initial session:', error);
          setLoading(false);
          return;
        }

        console.log('✅ Initial session retrieved:', session?.user?.email || 'No session');
        
        // Trigger auth change handler with initial session
        await handleAuthChange('INITIAL_SESSION', session);
      } catch (error) {
        console.error('💥 Exception during auth initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up auth context');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        return { error };
      }

      console.log('✅ Sign in successful for:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 Sign in exception:', error);
      return { error };
    }
  };

  /**
   * Sign up with email, password, and optional full name
   */
  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('📝 Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        return { error };
      }

      console.log('✅ Sign up successful for:', data.user?.email);
      return { error: null };
    } catch (error) {
      console.error('💥 Sign up exception:', error);
      return { error };
    }
  };

  /**
   * Sign out user and clear all state
   */
  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
      }

      // Clear all state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      setProfileLoading(false);
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('💥 Sign out exception:', error);
    }
  };

  // Computed properties
  const isAuthenticated = !!user && !!session;
  const isAdmin = profile?.role === 'admin';
  const isUser = profile?.role === 'user';

  // Log current auth state for debugging
  console.log('📊 Auth State:', {
    user: !!user,
    session: !!session,
    profile: !!profile,
    loading,
    profileLoading,
    isAuthenticated,
    isAdmin,
    isUser,
    userEmail: user?.email,
    profileRole: profile?.role
  });

  const value: AuthContextType = {
    // State
    user,
    session,
    profile,
    loading,
    profileLoading,
    
    // Computed
    isAuthenticated,
    isAdmin,
    isUser,
    
    // Methods
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
