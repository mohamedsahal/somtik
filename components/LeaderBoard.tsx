import { View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

export default function LeaderBoard() {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopUsers();
  }, []);

  const fetchTopUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          followers:follower_following!follower_id(count)
        `)
        .not('username', 'is', null)
        .order('followers', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        ...user,
        followers: user.followers?.[0]?.count || 0
      }));

      setTopUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching top users:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={styles.userRow}
      onPress={() => router.push(`/user/${item.id}`)}
    >
      <ThemedText style={styles.rank}>{index + 1}</ThemedText>
      
      <Image
        source={{ 
          uri: item.avatar_url || 
            'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        }}
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
        <ThemedText style={styles.followers}>
          {formatNumber(item.followers)} followers
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  if (topUsers.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText>No users found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Top Creators</ThemedText>
      
      <FlatList
        data={topUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

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
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rank: {
    width: 24,
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  followers: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
}); 