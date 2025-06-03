
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkAdminStatus(session.user.id);
          } else {
            setIsAdmin(false);
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('check_user_is_admin', {
          check_user_id: userId
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          if (mounted) {
            setIsAdmin(false);
          }
          return;
        }

        if (mounted) {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (mounted) {
          setIsAdmin(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        if (initialized) {
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
    if (!error) {
      // Auth state change will handle the rest
    } else {
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
      // Create admin user record
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
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
    return { error };
  };

  return {
    user,
    session,
    isAdmin,
    loading: loading || !initialized,
    signIn,
    signUp,
    signOut,
  };
};
