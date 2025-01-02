import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://kmkdgedmcgsxexlzydtu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta2RnZWRtY2dzeGV4bHp5ZHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2MzgxNzMsImV4cCI6MjA1MTIxNDE3M30.ev6feUSO8m98KqxE7OiZZQZjQfjtAKUdcvqa5mXuYBA';

// Create a custom storage object that works for both web and native
const customStorage = {
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error storing value:', error);
    }
  },
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving value:', error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing value:', error);
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test the connection and log any errors
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});

export const cleanupUnverifiedUsers = async () => {
  try {
    const { data, error } = await supabase.rpc('clean_unverified_users');
    
    if (error) {
      console.error('Error cleaning up unverified users:', error);
      throw error;
    }

    console.log('Successfully cleaned up unverified users');
    return data;
  } catch (error) {
    console.error('Error in cleanupUnverifiedUsers:', error);
    throw error;
  }
};

export const checkProfileCreation = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking profile:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkProfileCreation:', error);
    return false;
  }
};

export const retryProfileCreation = async (
  userId: string,
  username: string,
  email: string
) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username,
        email,
        followers: 0,
        following: 0,
        likes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Retry profile creation error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in retryProfileCreation:', error);
    return false;
  }
}; 