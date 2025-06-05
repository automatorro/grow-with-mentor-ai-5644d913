
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  is_premium: boolean;
  is_admin: boolean;
  current_phase: number;
  completed_phases: number[];
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  isAdmin: boolean;
  currentPhase: number;
  completedPhases: number[];
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  socialLogin: (provider: 'google' | 'facebook' | 'github') => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserPhase: (phase: number) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const transformProfileToUser = (supabaseUser: User, profile: Profile): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: profile.name || supabaseUser.email!.split('@')[0],
      isPremium: profile.is_premium,
      isAdmin: profile.is_admin,
      currentPhase: profile.current_phase,
      completedPhases: profile.completed_phases,
    };
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state updates
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            if (profileData) {
              setProfile(profileData);
              setUser(transformProfileToUser(session.user, profileData));
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(async () => {
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
            setUser(transformProfileToUser(session.user, profileData));
          }
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook' | 'github'): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateUserPhase = async (phase: number) => {
    if (!user || !profile) return;

    try {
      const updatedCompletedPhases = [...user.completedPhases, phase - 1]
        .filter((p, i, arr) => arr.indexOf(p) === i && p > 0);

      const { error } = await supabase
        .from('profiles')
        .update({
          current_phase: phase,
          completed_phases: updatedCompletedPhases,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user phase:', error);
        return;
      }

      // Update local state
      const updatedProfile = {
        ...profile,
        current_phase: phase,
        completed_phases: updatedCompletedPhases,
      };
      setProfile(updatedProfile);
      
      if (session?.user) {
        setUser(transformProfileToUser(session.user, updatedProfile));
      }
    } catch (error) {
      console.error('Error updating user phase:', error);
    }
  };

  const upgradeToPremium = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error upgrading to premium:', error);
        return;
      }

      // Update local state
      const updatedProfile = { ...profile, is_premium: true };
      setProfile(updatedProfile);
      
      if (session?.user) {
        setUser(transformProfileToUser(session.user, updatedProfile));
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    }
  };

  const refreshSubscription = async () => {
    if (!session?.user) return;

    const profileData = await fetchProfile(session.user.id);
    if (profileData) {
      setProfile(profileData);
      setUser(transformProfileToUser(session.user, profileData));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      login,
      signup,
      socialLogin,
      logout,
      loading,
      updateUserPhase,
      upgradeToPremium,
      refreshSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
};
