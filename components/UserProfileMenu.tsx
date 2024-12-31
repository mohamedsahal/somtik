import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Image
} from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

type Video = {
  id: string;
  thumbnail: string;
  views: string;
};

type ProfileData = {
  username: string;
  avatar: string;
  bio: string;
  followers: string;
  following: string;
  likes: string;
  postedVideos: Video[];
  privateVideos: Video[];
  likedVideos: Video[];
  savedVideos: Video[];
};

export function UserProfileMenu() {
  const { session } = useAuth();
  const user = session?.user;
  const [activeTab, setActiveTab] = React.useState('posted');
  
  const profileData: ProfileData = {
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || '@user',
    avatar: user?.user_metadata?.avatar_url || 'https://picsum.photos/200',
    bio: user?.user_metadata?.bio || 'Welcome to my profile! 👋',
    followers: '0',
    following: '0',
    likes: '0',
    postedVideos: [
      { id: '1', thumbnail: 'https://picsum.photos/300/400', views: '1.2K' },
      // Add more videos...
    ],
    privateVideos: [
      { id: '1', thumbnail: 'https://picsum.photos/300/400', views: 'Private' },
      // Add more videos...
    ],
    likedVideos: [
      { id: '1', thumbnail: 'https://picsum.photos/300/400', views: '5.6K' },
      // Add more videos...
    ],
    savedVideos: [
      { id: '1', thumbnail: 'https://picsum.photos/300/400', views: '3.4K' },
      // Add more videos...
    ],
  };

  const renderVideoGrid = (videos: Video[]) => (
    <View style={styles.videoGrid}>
      {videos.map(video => (
        <TouchableOpacity key={video.id} style={styles.videoItem}>
          <View style={styles.thumbnail}>
            <ThemedText style={styles.views}>{video.views}</ThemedText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <TouchableOpacity style={styles.menuButton}>
          <IconSymbol name="line.3.horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: profileData.avatar }}
            style={styles.avatar}
          />
        </View>
        <ThemedText style={styles.username}>{profileData.username}</ThemedText>
        
        <View style={styles.statsContainer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{profileData.followers}</ThemedText>
              <ThemedText style={styles.statLabel}>Followers</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{profileData.following}</ThemedText>
              <ThemedText style={styles.statLabel}>Following</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>{profileData.likes}</ThemedText>
              <ThemedText style={styles.statLabel}>Likes</ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <ThemedText style={styles.editButtonText}>Edit Profile</ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.bio}>{profileData.bio}</ThemedText>
      </View>

      {/* Video Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posted' && styles.activeTab]}
          onPress={() => setActiveTab('posted')}
        >
          <IconSymbol 
            name="grid" 
            size={24} 
            color={activeTab === 'posted' ? '#fff' : '#888'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'private' && styles.activeTab]}
          onPress={() => setActiveTab('private')}
        >
          <IconSymbol 
            name="lock" 
            size={24} 
            color={activeTab === 'private' ? '#fff' : '#888'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
          onPress={() => setActiveTab('liked')}
        >
          <IconSymbol 
            name="heart.fill" 
            size={24} 
            color={activeTab === 'liked' ? '#fff' : '#888'} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <IconSymbol 
            name="bookmark.fill" 
            size={24} 
            color={activeTab === 'saved' ? '#fff' : '#888'} 
          />
        </TouchableOpacity>
      </View>

      {/* Video Grid */}
      <ScrollView>
        {activeTab === 'posted' && renderVideoGrid(profileData.postedVideos)}
        {activeTab === 'private' && renderVideoGrid(profileData.privateVideos)}
        {activeTab === 'liked' && renderVideoGrid(profileData.likedVideos)}
        {activeTab === 'saved' && renderVideoGrid(profileData.savedVideos)}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    width: 40,
  },
  menuButton: {
    padding: 8,
    width: 40,
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  profileInfo: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#333',
    marginHorizontal: 8,
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  bio: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  videoItem: {
    width: width / 3 - 2,
    aspectRatio: 3/4,
    margin: 1,
    backgroundColor: '#333',
  },
  thumbnail: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  views: {
    color: '#fff',
    fontSize: 12,
  },
}); 