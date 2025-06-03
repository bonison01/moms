
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    // Simple function to check if user is admin by directly querying admin_users table
    const checkAdminStatus = async (userId: string) => {
      try {
        // Direct query to admin_users table without using the RPC function
        const { data, error } = await supabase
          .from('admin_users')
          .select('id')
          .eq('user_id', userId)
          .limit(1);
        
        if (!mounted) return;

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data && data.length > 0);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
        
        if (event === 'SIGNED_OUT') {
          setLoading(false);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setLoading(false);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`
      }
    });

    if (!error && data.user) {
      // Create admin user record directly
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert([{ user_id: data.user.id, role: 'admin' }]);
      
      if (adminError) {
        console.error('Error creating admin user:', adminError);
        setLoading(false);
        return { error: adminError };
      }
    }

    if (error) {
      setLoading(false);
    }
    return { error };
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setLoading(false);
    return { error };
  };

  return {
    user,
    session,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
