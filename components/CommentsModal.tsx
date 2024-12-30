import React, { useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Comment = {
  id: string;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
};

type CommentsModalProps = {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onLikeComment: (commentId: string) => void;
};

export function CommentsModal({ visible, onClose, comments, onAddComment, onLikeComment }: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const renderComment = ({ item: comment }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentContent}>
        <ThemedText style={styles.username}>{comment.username}</ThemedText>
        <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
        <View style={styles.commentInfo}>
          <ThemedText style={styles.timestamp}>{comment.timestamp}</ThemedText>
          <View style={styles.likesContainer}>
            <TouchableOpacity 
              style={styles.likeButton}
              onPress={() => onLikeComment(comment.id)}
            >
              <ThemedText style={styles.likeText}>
                {comment.likes} {comment.likes === 1 ? 'like' : 'likes'}
              </ThemedText>
              <IconSymbol 
                name="heart.fill"
                size={12}
                color={comment.isLiked ? '#ff2d55' : '#888'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <IconSymbol name="xmark" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Comments</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!newComment.trim()}
          >
            <IconSymbol 
              name="paperplane.fill"
              size={24}
              color={newComment.trim() ? '#fff' : '#888'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  commentsContainer: {
    padding: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  commentText: {
    color: '#fff',
    marginBottom: 4,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    color: '#888',
    fontSize: 12,
    marginRight: 16,
  },
  likesContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    color: '#888',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff2d55',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
  },
}); 