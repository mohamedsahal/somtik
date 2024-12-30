import React from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

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
  const [newComment, setNewComment] = React.useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const renderComment = ({ item: comment }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <ThemedText style={styles.username}>{comment.username}</ThemedText>
        <ThemedText style={styles.timestamp}>{comment.timestamp}</ThemedText>
      </View>
      <View style={styles.commentContent}>
        <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={() => onLikeComment(comment.id)}
        >
          <IconSymbol 
            name="heart.fill" 
            size={12} 
            color={comment.isLiked ? '#ff2d55' : '#888'}
          />
          <ThemedText style={[
            styles.likeCount,
            comment.isLiked && styles.likedCount
          ]}>
            {comment.likes}
          </ThemedText>
        </TouchableOpacity>
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Comments</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              onPress={handleSubmit}
              style={styles.postButton}
              disabled={!newComment.trim()}
            >
              <ThemedText style={[
                styles.postButtonText,
                !newComment.trim() && styles.postButtonDisabled
              ]}>
                Post
              </ThemedText>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '80%',
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
  },
  commentsList: {
    flex: 1,
  },
  commentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  likeCount: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#fff',
    marginRight: 10,
    maxHeight: 100,
  },
  postButton: {
    paddingHorizontal: 15,
  },
  postButtonText: {
    color: '#ff2d55',
    fontWeight: 'bold',
  },
  postButtonDisabled: {
    color: '#666',
  },
  likedCount: {
    color: '#ff2d55',
  },
}); 