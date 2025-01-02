import { View, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const { id } = useLocalSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // Add your follow/unfollow logic here
  };

  return (
    <View style={[styles.container]}>
      <ScrollView>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: profile?.avatar_url || 'https://via.placeholder.com/96' }}
            style={styles.avatar}
          />
          <ThemedText style={styles.username}>
            {profile?.username || '@username'}
          </ThemedText>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {profile?.following || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {profile?.followers || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>
                {profile?.likes || 0}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Likes</ThemedText>
            </View>
          </View>

          {/* Bio */}
          <ThemedText style={styles.bio}>
            {profile?.bio || 'No bio yet'}
          </ThemedText>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.followButton,
                isFollowing && styles.followingButton
              ]}
              onPress={toggleFollow}
            >
              <ThemedText style={[
                styles.followButtonText,
                isFollowing && styles.followingButtonText
              ]}>
                {isFollowing ? 'Following' : 'Follow'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <IconSymbol 
              name="square.grid.2x2" 
              size={24} 
              color={activeTab === 'posts' ? '#fff' : '#888'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <IconSymbol 
              name="heart" 
              size={24} 
              color={activeTab === 'liked' ? '#fff' : '#888'} 
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsGrid}>
          {Array.from({ length: 12 }).map((_, index) => (
            <View key={index} style={styles.postItem}>
              <Image
                source={{ uri: `https://picsum.photos/300/450?random=${index}` }}
                style={styles.postThumbnail}
              />
              <View style={styles.viewsOverlay}>
                <IconSymbol name="play.fill" size={12} color="#fff" />
                <ThemedText style={styles.viewsText}>
                  {Math.floor(Math.random() * 1000)}K
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  profileInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
  },
  bio: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    backgroundColor: BRAND.primary,
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 4,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#888',
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  followingButtonText: {
    color: '#888',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postItem: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    padding: 1,
  },
  postThumbnail: {
    flex: 1,
    backgroundColor: '#222',
  },
  viewsOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 