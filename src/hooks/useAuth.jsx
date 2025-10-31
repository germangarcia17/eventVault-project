import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      analytics.trackLogin('email');
      toast({ title: 'Welcome!', description: 'You have successfully signed in.' });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not sign in',
        variant: 'destructive',
      });
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
      analytics.trackSignup('email');
      toast({
        title: 'Account Created',
        description: 'Check your email to confirm your account.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      analytics.trackLogout();
      toast({ title: 'Signed Out', description: 'You have successfully signed out.' });
      navigate('/', { state: { fromInternal: true } });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not sign out',
        variant: 'destructive',
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      analytics.trackLogin('google');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Could not sign in with Google',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
