import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
          </View>
          <ThemedText style={styles.username}>@username</ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>124</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>8.5K</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>12.3K</ThemedText>
            <ThemedText style={styles.statLabel}>Likes</ThemedText>
          </View>
        </View>

        <View style={styles.editProfileButton}>
          <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
        </View>
      </View>

      {/* Video Grid */}
      <ScrollView>
        <View style={styles.videoGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.videoThumbnail}>
              <View style={[styles.thumbnail, { backgroundColor: `#${item}${item}${item}` }]} />
              <View style={styles.videoStats}>
                <IconSymbol name="play.fill" size={12} color="#fff" />
                <ThemedText style={styles.videoViews}>12.3K</ThemedText>
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
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  editProfileButton: {
    borderWidth: 1,
    borderColor: '#333',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#fff',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
  },
  videoThumbnail: {
    width: '33.33%',
    aspectRatio: 3/4,
    padding: 1,
  },
  thumbnail: {
    flex: 1,
  },
  videoStats: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoViews: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
}); 