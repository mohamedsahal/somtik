import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BRAND } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity 
        style={[styles.closeButton, { top: insets.top + 10 }]}
      >
        <IconSymbol name="xmark" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Camera Preview Placeholder */}
      <View style={styles.cameraPreview} />

      {/* Right Side Controls */}
      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.rightControlButton}>
          <IconSymbol name="camera.rotate.fill" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightControlButton}>
          <IconSymbol name="bolt.fill" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightControlButton}>
          <IconSymbol name="gauge" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightControlButton}>
          <IconSymbol name="timer" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightControlButton}>
          <IconSymbol name="wand.and.stars" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <BlurView intensity={30} style={styles.bottomControls}>
        <View style={styles.controlsContainer}>
          {/* Bottom Options */}
          <View style={styles.bottomOptions}>
            <TouchableOpacity style={styles.optionButton}>
              <ThemedText style={styles.optionText}>Upload</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recordButton}>
              <View style={styles.recordButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <ThemedText style={styles.optionText}>Filters</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  rightControls: {
    position: 'absolute',
    right: 16,
    top: '40%',
    transform: [{ translateY: -100 }],
    gap: 20,
    alignItems: 'center',
  },
  rightControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  optionButton: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(36, 110, 233, 0.2)',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: BRAND.primary, // Royal blue color
  },
}); 