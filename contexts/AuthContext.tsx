import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Alert } from 'react-native';

type TempCredentials = {
  password: string;
  username: string;
} | null;

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  verifyOTP: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  currentEmail: string | null;
  resendOTP: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [tempCredentials, setTempCredentials] = useState<TempCredentials>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // First, check if email exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUsers) {
        throw new Error('Email already registered');
      }

      // Create the user first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: null,
            bio: null,
          },
          emailRedirectTo: 'somtik://'
        }
      });

      if (signUpError) throw signUpError;

      // Store email and credentials for verification
      setCurrentEmail(email);
      setTempCredentials({ password, username });

      Alert.alert(
        'Verification Required',
        'Please check your email for a verification code.',
        [{ text: 'OK', onPress: () => router.push('/auth/verify-email') }]
      );

    } catch (error: any) {
      setCurrentEmail(null);
      setTempCredentials(null);
      console.error('Error in signUp function:', error);
      throw error;
    }
  };

  const verifyOTP = async (token: string) => {
    if (!currentEmail || !tempCredentials) {
      throw new Error('Missing registration information');
    }

    try {
      // Verify the OTP
      const { data, error } = await supabase.auth.verifyOtp({
        email: currentEmail,
        token,
        type: 'signup'
      });

      if (error) {
        console.error('Verification error details:', error);
        throw new Error(error.message || 'Failed to verify email');
      }

      if (!data?.user) {
        throw new Error('No user data received after verification');
      }

      // Sign in the user first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: tempCredentials.password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Failed to sign in after verification');
      }

      // Now create the profile with the authenticated session
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: tempCredentials.username,
          email: currentEmail,
          followers: 0,
          following: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Profile creation error details:', profileError);
        // Don't throw here, just log the error since the user is already verified and signed in
        console.warn('Failed to create profile, but user is verified:', profileError.message);
      }

      // Clear temporary data
      setCurrentEmail(null);
      setTempCredentials(null);
      
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Full verification error:', {
        message: error.message,
        details: error,
        stack: error.stack,
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Only log actual errors, not authentication failures
        if (error.message !== 'Invalid login credentials') {
          console.error('Error signing in:', error);
        }
        throw error;
      }
      router.replace('/(tabs)');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resendOTP = async () => {
    if (!currentEmail) {
      throw new Error('No email found');
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentEmail,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error resending verification:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      loading, 
      signIn, 
      signUp, 
      verifyOTP,
      signOut,
      currentEmail,
      resendOTP,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 