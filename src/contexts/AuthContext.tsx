import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  credits: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateCredits: (credits: number) => void;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          // Get or create user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (!profile && session.user.email) {
            // Create profile for new user
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                user_id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email.split('@')[0],
                email: session.user.email,
                role: session.user.email === 'admin@example.com' ? 'admin' : 'user',
                credits: 100
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
              return;
            }
            
            setUser({
              id: session.user.id,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role as 'user' | 'admin',
              credits: newProfile.credits
            });
          } else if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as 'user' | 'admin',
              credits: profile.credits
            });
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // This will trigger the onAuthStateChange callback
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account."
      });
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
    localStorage.removeItem('hasSeenVideo');
  };

  const updateCredits = async (credits: number) => {
    if (user && supabaseUser) {
      const { error } = await supabase
        .from('profiles')
        .update({ credits })
        .eq('user_id', supabaseUser.id);
      
      if (!error) {
        setUser({ ...user, credits });
      }
    }
  };

  const value = {
    user,
    supabaseUser,
    login,
    signup,
    logout,
    updateCredits,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};