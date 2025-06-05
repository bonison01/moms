
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch user profile - separate from auth state to avoid deadlocks
  const fetchProfile = async (userId: string) => {
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
      } else {
        console.log('Profile fetched successfully:', data);
        // Type cast the role to ensure compatibility
        const profileData: UserProfile = {
          ...data,
          role: data.role as UserRole
        };
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth state listener');

    // Set up auth state listener - CRITICAL: Keep this synchronous
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        // Only synchronous updates in the callback
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle profile fetching after the callback completes
        if (session?.user) {
          // Use setTimeout to defer async operations - prevents deadlocks
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id);
            }
          }, 0);
        } else {
          setProfile(null);
          setProfileLoading(false);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('Initial session:', session?.user?.email || 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful:', data.user?.email);
      }
      
      return { data, error };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName || '',
          },
        },
      });
      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      const { error } = await supabase.auth.signOut();
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      setProfile(null);
      setLoading(false);
      setProfileLoading(false);
      
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isPaying = false; // Not used in new system
  const isFree = profile?.role === 'user';

  console.log('Auth state:', {
    user: !!user,
    profile: !!profile,
    loading,
    profileLoading,
    isAdmin,
    userEmail: user?.email,
    profileRole: profile?.role
  });

  return {
    user,
    session,
    profile,
    loading,
    profileLoading,
    isAdmin,
    isPaying,
    isFree,
    signIn,
    signUp,
    signOut,
    fetchProfile,
  };
};
