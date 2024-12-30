import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import type { Post } from '@/app/(tabs)/index';

type PostInfoProps = {
  post: Post;
};

export function PostInfo({ post }: PostInfoProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.username}>{post.user.username}</ThemedText>
      <ThemedText style={styles.description}>{post.description}</ThemedText>
      <View style={styles.audioContainer}>
        <IconSymbol name="music.note" size={15} color="#fff" />
        <ThemedText style={styles.audioText}>{post.audioTrack}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingRight: 80, // Leave space for actions
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
}); 