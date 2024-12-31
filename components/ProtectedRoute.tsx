import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from './ThemedText';
import { router } from 'expo-router';
import { Logo } from './Logo';
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { supabase } from '@/lib/supabase';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkVerification() {
      if (session?.user) {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (!error && user?.email_confirmed_at) {
          setIsVerified(true);
        } else if (user?.email && !user.email_confirmed_at) {
          // If email exists but not confirmed
          setCurrentEmail(user.email);
          router.push('/auth/verify-email');
        }
      }
      setCheckingVerification(false);
    }

    checkVerification();
  }, [session]);

  if (loading || checkingVerification) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Logo />
        <ThemedText style={styles.title}>Join Somtik</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign up to follow creators, like videos, and view comments.
        </ThemedText>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/auth/signup')}
        >
          <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <ThemedText style={styles.loginLink}>Sign In</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isVerified) {
    return (
      <View style={styles.container}>
        <Logo />
        <ThemedText style={styles.title}>Verify Your Email</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please verify your email address to continue.
        </ThemedText>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/auth/verify-email')}
        >
          <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#ff2d55',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  loginText: {
    color: '#888',
  },
  loginLink: {
    color: '#ff2d55',
    fontWeight: 'bold',
  },
}); 