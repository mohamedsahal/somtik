import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Animated, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useProfile } from '@/contexts/ProfileContext';

const { width } = Dimensions.get('window');
const THUMBNAIL_WIDTH = width / 3;
const THUMBNAIL_HEIGHT = THUMBNAIL_WIDTH * 1.5;

const BRAND = {
  primary: '#246EE9',
  secondary: '#FFFFFF',
  accent: '#FFA23C',
  dark: {
    background: '#000000',
    surface: '#121212',
    border: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#EEEEEE',
  }
};

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  
  const { profile, setProfile, updateProfile } = useProfile();

  console.log('Current profile data:', profile);

  useEffect(() => {
    if (session?.user) {
      fetchMyProfile();
      fetchMyPosts();
    }
  }, [session]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchMyProfile();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const fetchMyProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      console.log('Fetched profile data:', data);

      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: session.user.id,
          username: session.user.email?.split('@')[0] || '',
          full_name: '',
          bio: '',
          avatar_url: '',
          followers_count: 0,
          following_count: 0,
          likes_count: 0,
          updated_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        data = createdProfile;
      } else if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMyPosts = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          video_url,
          thumbnail_url,
          description,
          created_at,
          views_count,
          likes_count,
          comments_count,
          is_private
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setMenuVisible(false);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEditProfile = async () => {
    if (session?.user) {
      await router.push('/edit-profile');
      setShouldRefresh(true);
    }
  };

  useEffect(() => {
    const unsubscribe = () => {
      if (shouldRefresh) {
        fetchMyProfile();
        setShouldRefresh(false);
      }
    };

    unsubscribe();
    return unsubscribe;
  }, [shouldRefresh]);

  useEffect(() => {
    console.log('Profile updated:', profile);
  }, [profile]);

  if (!session) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <ThemedText style={styles.username}>Profile</ThemedText>
        </View>
        <View style={styles.authPrompt}>
          <View style={styles.placeholderIcon}>
            <MaterialIcons 
              name="person-circle" 
              size={120} 
              color="#666" 
            />
          </View>
          <ThemedText style={styles.promptTitle}>Join Somtik</ThemedText>
          <ThemedText style={styles.promptText}>
            Create an account to follow your favorite creators, like videos, and share your own content
          </ThemedText>
          
          <View style={styles.authButtons}>
            <TouchableOpacity 
              style={styles.signUpButton}
              onPress={() => router.push('/auth/signup')}
            >
              <ThemedText style={styles.signUpButtonText}>Sign up</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <ThemedText style={styles.loginButtonText}>Log in</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Return your existing profile UI for logged-in users
  return (
    <View style={styles.container}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, { opacity: headerOpacity }]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          {/* Remove the ThemedText component with username */}
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: profile?.avatar_url || 
                  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' 
              }}
              style={styles.avatar}
            />
          </View>
          
          {/* Name and Username */}
          <ThemedText style={styles.name}>
            {profile?.full_name || 'Add your name'}
          </ThemedText>
          <ThemedText style={styles.handle}>
            @{profile?.username || session?.user?.email?.split('@')[0] || ''}
          </ThemedText>
          
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile?.following_count || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile?.followers_count || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>
                {profile?.likes_count || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Likes</ThemedText>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <ThemedText style={styles.bioText}>
              {profile?.bio || 'Tap to add bio'}
            </ThemedText>
          </View>

          {/* Edit Button */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <MaterialIcons 
              name="grid-on" 
              size={24} 
              color={activeTab === 'posts' ? BRAND.primary : BRAND.dark.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
            onPress={() => setActiveTab('likes')}
          >
            <MaterialIcons 
              name="favorite-border" 
              size={24} 
              color={activeTab === 'likes' ? BRAND.primary : BRAND.dark.textSecondary} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'private' && styles.activeTab]}
            onPress={() => setActiveTab('private')}
          >
            <MaterialIcons 
              name="lock-outline" 
              size={24} 
              color={activeTab === 'private' ? BRAND.primary : BRAND.dark.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Content Grid */}
        <View style={styles.contentGrid}>
          {posts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.thumbnail}>
              <Image
                source={{ uri: post.thumbnail_url }}
                style={styles.thumbnailImage}
              />
              <View style={styles.videoStats}>
                <MaterialIcons name="play-arrow" size={12} color="#fff" />
                <ThemedText style={styles.videoViews}>
                  {formatNumber(post.views_count)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Add the Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/settings');
              }}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
              <ThemedText style={styles.menuText}>Settings</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <ThemedText style={[styles.menuText, styles.logoutText]}>
                Log out
              </ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 2,
  },
  headerLeft: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: BRAND.dark.border,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 50,
    zIndex: -1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  handle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  bioSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  bioText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 4,
    backgroundColor: BRAND.primary,
    marginBottom: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: BRAND.primary,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    padding: 0.5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoStats: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoViews: {
    fontSize: 12,
    marginLeft: 4,
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  placeholderIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  promptTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  signUpButton: {
    backgroundColor: BRAND.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#fff',
  },
  logoutText: {
    color: '#FF3B30', // Red color for logout
  },
});