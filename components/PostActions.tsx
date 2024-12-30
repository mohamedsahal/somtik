import { View, StyleSheet, Pressable } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { ThemedText } from './ThemedText';
import type { Post } from '@/app/(tabs)/index';

type PostActionsProps = {
  post: Post;
};

type ActionButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

export function PostActions({ post }: PostActionsProps) {
  return (
    <View style={styles.container}>
      <ActionButton
        icon="heart.fill"
        label={formatNumber(post.likes)}
        onPress={() => {/* Handle like */}}
      />
      <ActionButton
        icon="message.fill"
        label={formatNumber(post.comments)}
        onPress={() => {/* Handle comment */}}
      />
      <ActionButton
        icon="square.and.arrow.up.fill"
        label={formatNumber(post.shares)}
        onPress={() => {/* Handle share */}}
      />
    </View>
  );
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.action}>
      <IconSymbol name={icon} size={35} color="#fff" />
      <ThemedText style={styles.actionText}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 8,
    bottom: 100,
    alignItems: 'center',
  },
  action: {
    alignItems: 'center',
    marginVertical: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
} 