import { View, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

type TabType = 'posts' | 'likes' | 'favorites';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const posts = [
    { id: '1', thumbnail: 'https://picsum.photos/300/400', views: '1.2M' },
    { id: '2', thumbnail: 'https://picsum.photos/300/401', views: '856K' },
    // Add more posts...
  ];

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.postThumbnail} />
      <View style={styles.viewsOverlay}>
        <IconSymbol name="play.fill" size={12} color="#fff" />
        <ThemedText style={styles.viewsText}>{item.views}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <IconSymbol name="bookmark.fill" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <IconSymbol name="square.and.arrow.up.fill" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Image 
          source={{ uri: 'https://picsum.photos/200' }}
          style={styles.avatar}
        />
        <ThemedText style={styles.username}>{id}</ThemedText>
        
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>234</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>12.3K</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>123K</ThemedText>
            <ThemedText style={styles.statLabel}>Likes</ThemedText>
          </View>
        </View>

        {/* Bio */}
        <ThemedText style={styles.bio}>✨ Creating awesome content\nFollow for more!</ThemedText>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.followButton,
              isFollowing && styles.followingButton
            ]}
            onPress={handleFollow}
          >
            <ThemedText style={[
              styles.followButtonText,
              isFollowing && styles.followingButtonText
            ]}>
              {isFollowing ? 'Following' : 'Follow'}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <IconSymbol name="message.fill" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <IconSymbol 
            name="grid" 
            size={24} 
            color={activeTab === 'posts' ? '#fff' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'likes' && styles.activeTab]}
          onPress={() => setActiveTab('likes')}
        >
          <IconSymbol 
            name="heart.fill" 
            size={24} 
            color={activeTab === 'likes' ? '#fff' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}
        >
          <IconSymbol 
            name="bookmark.fill" 
            size={24} 
            color={activeTab === 'favorites' ? '#fff' : '#888'}
          />
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
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
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  followButton: {
    backgroundColor: '#ff2d55',
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
  messageButton: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 4,
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
  postItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.5,
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