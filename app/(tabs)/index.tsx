import { StyleSheet, Dimensions, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';

const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('for-you');

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.topNavIcon}>
          <IconSymbol name="broadcast.fill" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.tabs}>
          <TouchableOpacity 
            onPress={() => setActiveTab('following')}
            style={styles.tab}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'following' && styles.activeTabText
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
              activeTab === 'for-you' && styles.activeTabText
            ]}>
              For You
            </ThemedText>
            {activeTab === 'for-you' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.topNavIcon}>
          <IconSymbol name="magnifyingglass" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Existing ScrollView Content */}
      <ScrollView pagingEnabled style={styles.content}>
        {/* Video Post 1 */}
        <View style={styles.postContainer}>
          <View style={[styles.video, { backgroundColor: '#333' }]} />
          
          {/* Right Side Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionButton}>
              <IconSymbol 
                name="heart.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>123.4K</ThemedText>
            </View>
            
            <View style={styles.actionButton}>
              <IconSymbol 
                name="message.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>1,234</ThemedText>
            </View>
            
            <View style={styles.actionButton}>
              <IconSymbol 
                name="square.and.arrow.up.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>Share</ThemedText>
            </View>
          </View>

          {/* Bottom Info */}
          <View style={styles.infoContainer}>
            <ThemedText style={styles.username}>@username</ThemedText>
            <ThemedText style={styles.description}>
              Check out this amazing video! 🎉 #trending #viral
            </ThemedText>
            <View style={styles.musicContainer}>
              <IconSymbol 
                name="music.note"
                size={15}
                color="#fff"
              />
              <ThemedText style={styles.musicText}>
                Original Sound - Username
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Video Post 2 - Similar structure */}
        <View style={styles.postContainer}>
          <View style={[styles.video, { backgroundColor: '#444' }]} />
          {/* Right Side Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionButton}>
              <IconSymbol 
                name="heart.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>89.1K</ThemedText>
            </View>
            
            <View style={styles.actionButton}>
              <IconSymbol 
                name="message.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>912</ThemedText>
            </View>
            
            <View style={styles.actionButton}>
              <IconSymbol 
                name="square.and.arrow.up.fill"
                size={35}
                color="#fff"
              />
              <ThemedText style={styles.actionText}>Share</ThemedText>
            </View>
          </View>

          {/* Bottom Info */}
          <View style={styles.infoContainer}>
            <ThemedText style={styles.username}>@user2</ThemedText>
            <ThemedText style={styles.description}>
              Another cool video 🔥 #fun #viral
            </ThemedText>
            <View style={styles.musicContainer}>
              <IconSymbol 
                name="music.note"
                size={15}
                color="#fff"
              />
              <ThemedText style={styles.musicText}>
                Popular Song - Artist
              </ThemedText>
            </View>
          </View>
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  postContainer: {
    height,
    width,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  actionsContainer: {
    position: 'absolute',
    right: 8,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
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
});
