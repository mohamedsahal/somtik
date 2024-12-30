import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';

import { ThemedText } from './ThemedText';
import { PostActions } from './PostActions';
import { PostInfo } from './PostInfo';
import type { Post } from '@/app/(tabs)/index';

const { height, width } = Dimensions.get('window');

type VideoPostProps = {
  post: Post;
  isActive: boolean;
};

export function VideoPost({ post, isActive }: VideoPostProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.pauseAsync();
    }
  }, [isActive]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={togglePlay} style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: post.videoUri }}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay={isActive && isPlaying}
        />
      </Pressable>
      
      <PostActions post={post} />
      <PostInfo post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height,
    width,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
}); 