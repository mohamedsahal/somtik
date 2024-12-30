import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type LeaderUser = {
  id: string;
  rank: number;
  username: string;
  followers: string;
  avatar: string;
  isVerified?: boolean;
};

const TOP_USERS: LeaderUser[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  rank: i + 1,
  username: `@user${i + 1}`,
  followers: `${(100 - i + Math.random()).toFixed(1)}M`,
  avatar: `https://picsum.photos/200?random=${i}`,
  isVerified: i < 30,
}));

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();

  const renderItem = ({ item }: { item: LeaderUser }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => router.push(`/user/${item.username}`)}
    >
      <View style={styles.rankContainer}>
        {item.rank <= 3 ? (
          <ThemedText style={[styles.rankText, styles.topRankText]}>
            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
          </ThemedText>
        ) : (
          <ThemedText style={styles.rankText}>
            #{item.rank}
          </ThemedText>
        )}
      </View>
      
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <View style={styles.usernameContainer}>
          <ThemedText style={styles.username}>{item.username}</ThemedText>
          {item.isVerified && (
            <IconSymbol name="checkmark.seal.fill" size={16} color="#1DA1F2" />
          )}
        </View>
        <ThemedText style={styles.followers}>{item.followers} Followers</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Leaderboard</ThemedText>
        <ThemedText style={styles.subtitle}>Top 100 Creators</ThemedText>
      </View>

      <FlatList
        data={TOP_USERS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  topRankText: {
    color: '#FFD700',
    fontSize: 18,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  followers: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
}); 