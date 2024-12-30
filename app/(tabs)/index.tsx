import { StyleSheet, Dimensions, View, TouchableOpacity, Animated, Easing, Image, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CommentsModal, Comment } from '@/components/CommentsModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

type Comment = {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
};

type PostData = {
  id: string;
  image: string;
  user: string;
  description: string;
  likes: number;
  comments: Comment[];
  music: string;
  liked: boolean;
  favorited: boolean;
  isFollowed: boolean;
};

const SAMPLE_POSTS = [
  {
    id: '1',
    image: 'https://images.pexels.com/photos/2792116/pexels-photo-2792116.jpeg',
    user: '@username',
    description: 'Check out this amazing video! 🎉 #trending #viral',
    likes: 123400,
    comments: [
      {
        id: '1',
        username: '@user1',
        text: 'This is amazing! 🔥',
        likes: 42,
        timestamp: '2h ago',
        isLiked: false
      },
      // Add more sample comments...
    ],
    music: 'Original Sound - Username',
    liked: false,
    favorited: false
  },
  {
    id: '2',
    image: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    user: '@user2',
    description: 'Another cool video 🔥 #fun #viral',
    likes: 89100,
    comments: [],
    music: 'Popular Song - Artist',
    liked: false,
    favorited: false
  }
];

function MusicDisc() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Create the animation
    spinAnimation.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Start the animation
    spinAnimation.current.start();

    // Cleanup function
    return () => {
      if (spinAnimation.current) {
        spinAnimation.current.stop();
      }
    };
  }, []); // Empty dependency array means this only runs once on mount

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.actionButton}>
      <Animated.View 
        style={[
          styles.musicDisc,
          { transform: [{ rotate }] }
        ]}
      >
        <View style={styles.musicDiscInner}>
          <View style={styles.musicDiscImage} />
          <IconSymbol 
            name="music.note"
            size={12}
            color="#fff"
          />
        </View>
      </Animated.View>
    </View>
  );
}

function FlippedIcon({ name, size, color }: { name: IconSymbolName; size: number; color: string }) {
  return (
    <View style={{ transform: [{ scaleX: -1 }] }}>
      <IconSymbol 
        name={name}
        size={size}
        color={color}
      />
    </View>
  );
}

function VideoPost({ image }: { image: string }) {
  return (
    <View style={styles.video}>
      <Image 
        source={{ uri: image }}
        style={styles.videoBackground}
        resizeMode="cover"
      />
    </View>
  );
}

function TopNavIcon({ name }: { name: IconSymbolName }) {
  return (
    <View style={styles.topNavIcon}>
      <IconSymbol name={name} size={24} color="#fff" style={styles.shadowedIcon} />
    </View>
  );
}

function LikeButton({ liked, likes, onPress }: { 
  liked: boolean; 
  likes: number;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    animateScale();
    onPress();
  };

  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={handlePress}
    >
      <View style={styles.actionIconShadow}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <IconSymbol 
            name="heart.fill"
            size={35}
            color={liked ? '#ff2d55' : '#fff'}
          />
        </Animated.View>
      </View>
      <ThemedText style={[styles.actionText, styles.actionTextShadow]}>
        {likes >= 1000 
          ? `${(likes/1000).toFixed(1)}K`
          : likes.toString()
        }
      </ThemedText>
    </TouchableOpacity>
  );
}

function FavoriteButton({ favorited, onPress }: { 
  favorited: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    animateScale();
    onPress();
  };

  return (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={handlePress}
    >
      <View style={styles.actionIconShadow}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <IconSymbol 
            name="bookmark.fill"
            size={35}
            color={favorited ? '#ff2d55' : '#fff'}
          />
        </Animated.View>
      </View>
      <ThemedText style={[styles.actionText, styles.actionTextShadow]}>
        Save
      </ThemedText>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('for-you');
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    console.log('Viewable items:', viewableItems);
  }).current;

  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const handleLike = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleCommentPress = (postId: string) => {
    setActivePostId(postId);
    setCommentModalVisible(true);
  };

  const handleAddComment = (text: string) => {
    if (!activePostId) return;

    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === activePostId) {
          const newComment: Comment = {
            id: Date.now().toString(),
            username: '@currentuser', // Replace with actual user
            text,
            likes: 0,
            timestamp: 'Just now',
            isLiked: false
          };
          return {
            ...post,
            comments: [newComment, ...post.comments]
          };
        }
        return post;
      })
    );
  };

  const handleCommentLike = (commentId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === activePostId && Array.isArray(post.comments)) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  isLiked: !comment.isLiked,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                };
              }
              return comment;
            })
          };
        }
        return post;
      })
    );
  };

  const handleFavorite = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            favorited: !post.favorited
          };
        }
        return post;
      })
    );
  };

  const renderItem = ({ item: post }) => (
    <View style={styles.postContainer}>
      <VideoPost image={post.image} />
      <View style={[
        styles.actionsContainer,
        { bottom: 100 + insets.bottom }
      ]}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconShadow}>
            <View style={styles.profileImageContainer}>
              <Image 
                source={{ uri: 'https://picsum.photos/200' }} // Placeholder image
                style={styles.profileImage}
              />
            </View>
            <View style={styles.plusIconContainer}>
              <IconSymbol 
                name="plus" 
                size={12} 
                color="#fff"
              />
            </View>
          </View>
          <ThemedText style={[styles.actionText, styles.actionTextShadow]}>
            Follow
          </ThemedText>
        </TouchableOpacity>

        <LikeButton 
          liked={post.liked}
          likes={post.likes}
          onPress={() => handleLike(post.id)}
        />
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCommentPress(post.id)}
        >
          <View style={styles.actionIconShadow}>
            <IconSymbol 
              name="message.fill"
              size={35}
              color="#fff"
            />
          </View>
          <ThemedText style={[styles.actionText, styles.actionTextShadow]}>
            {post.comments.length}
          </ThemedText>
        </TouchableOpacity>

        <FavoriteButton 
          favorited={post.favorited}
          onPress={() => handleFavorite(post.id)}
        />
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconShadow}>
            <View>
              <IconSymbol 
                name="arrowshape.turn.up.right.fill"
                size={35}
                color="#fff"
              />
            </View>
          </View>
          <ThemedText style={[styles.actionText, styles.actionTextShadow]}>
            Share
          </ThemedText>
        </TouchableOpacity>

        <MusicDisc />
      </View>

      <View style={[
        styles.infoContainer,
        { 
          paddingBottom: 32 + insets.bottom,
          bottom: insets.bottom
        }
      ]}>
        <ThemedText style={styles.username}>{post.user}</ThemedText>
        <ThemedText style={styles.description}>
          {post.description}
        </ThemedText>
        <View style={[
          styles.musicContainer,
          { marginBottom: insets.bottom }
        ]}>
          <IconSymbol 
            name="music.note"
            size={15}
            color="#fff"
          />
          <ThemedText style={styles.musicText}>
            {post.music}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[
        styles.topNav, 
        { 
          paddingTop: insets.top,
          height: 44 + insets.top 
        }
      ]}>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="live-tv" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.tabs}>
          <TouchableOpacity 
            onPress={() => setActiveTab('following')}
            style={styles.tab}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'following' && [styles.activeTabText, styles.shadowedText]
            ]}>
              Following
            </ThemedText>
            {activeTab === 'following' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('for-you')}
            style={styles.tab}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'for-you' && [styles.activeTabText, styles.shadowedText]
            ]}>
              For You
            </ThemedText>
            {activeTab === 'for-you' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchButton}>
          <IconSymbol name="magnifyingglass" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={3}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        style={styles.content}
      />

      <CommentsModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        comments={activePostId ? 
          (posts.find(p => p.id === activePostId)?.comments || [])
          : []
        }
        onAddComment={handleAddComment}
        onLikeComment={handleCommentLike}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  topNavIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: 2,
    position: 'relative',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
  },
  postContainer: {
    height,
    width,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  actionsContainer: {
    position: 'absolute',
    right: 8,
    alignItems: 'center',
    paddingBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 16,
    paddingRight: 80,
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
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  musicDisc: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  musicDiscInner: {
    width: '100%',
    height: '100%',
    borderRadius: 17.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
  },
  musicDiscImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#444',
  },
  shadowedIcon: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  shadowedText: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  actionShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  actionTextShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileImageContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#ff2d55',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    padding: 8,
  },
});
