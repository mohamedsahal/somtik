import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/components/Logo';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function VerifyEmailScreen() {
  const [token, setToken] = useState('');
  const { verifyOTP, currentEmail, resendOTP } = useAuth();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format the token as it's being typed
  const handleTokenChange = (text: string) => {
    // Remove any non-numeric characters
    const cleaned = text.replace(/[^0-9]/g, '');
    // Limit to 6 digits
    const formatted = cleaned.slice(0, 6);
    setToken(formatted);
  };

  const handleVerify = async () => {
    if (token.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(token);
    } catch (error: any) {
      console.error('Verification error:', {
        message: error.message,
        details: error,
      });
      
      let errorMessage = 'Failed to verify email. Please try again.';
      
      if (error.message?.includes('expired')) {
        errorMessage = 'Verification code has expired. Please request a new one.';
      } else if (error.message?.includes('invalid')) {
        errorMessage = 'Invalid verification code. Please check and try again.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) {
      Alert.alert('Please wait', `You can request a new code in ${timeLeft} seconds`);
      return;
    }

    setIsLoading(true);
    try {
      await resendOTP();
      setTimeLeft(60);
      setCanResend(false);
      Alert.alert('Success', 'A new verification code has been sent to your email');
    } catch (error: any) {
      if (error.message.includes('security purposes')) {
        Alert.alert('Please wait', 'For security reasons, please wait before requesting a new code');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if no email is stored
  if (!currentEmail) {
    router.replace('/auth/signup');
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner message="Please wait..." />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Logo />
        <ThemedText style={styles.title}>Verify Your Email</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 6-digit code sent to {currentEmail}
        </ThemedText>
      </View>

      <View style={styles.form}>
        <View style={styles.codeContainer}>
          {[...Array(6)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.codeBox,
                token[i] ? styles.codeBoxFilled : null
              ]}
            >
              <ThemedText style={styles.codeText}>
                {token[i] || ''}
              </ThemedText>
            </View>
          ))}
        </View>

        <TextInput
          style={styles.hiddenInput}
          value={token}
          onChangeText={handleTokenChange}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity 
          style={[
            styles.button,
            token.length !== 6 && styles.buttonDisabled
          ]} 
          onPress={handleVerify}
          disabled={token.length !== 6}
        >
          <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.resendButton,
            !canResend && styles.resendButtonDisabled
          ]}
          onPress={handleResend}
          disabled={!canResend}
        >
          <ThemedText style={[
            styles.resendText,
            !canResend && styles.resendTextDisabled
          ]}>
            {canResend 
              ? 'Resend Code' 
              : `Resend code in ${timeLeft}s`
            }
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginHorizontal: 24,
  },
  form: {
    paddingHorizontal: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeBox: {
    width: 45,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  codeBoxFilled: {
    borderColor: '#ff2d55',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  button: {
    backgroundColor: '#ff2d55',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#ff2d55',
    fontSize: 14,
  },
  resendTextDisabled: {
    color: '#888',
  },
}); 