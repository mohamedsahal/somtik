import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { cleanupUnverifiedUsers } from '@/lib/supabase';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function CleanupScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await cleanupUnverifiedUsers();
      Alert.alert('Success', 'Successfully cleaned up unverified users');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Cleaning up unverified users..." />;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Database Cleanup</ThemedText>
      <ThemedText style={styles.subtitle}>
        Remove all unverified users older than 24 hours
      </ThemedText>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleCleanup}
      >
        <ThemedText style={styles.buttonText}>
          Clean Up Unverified Users
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
}); 