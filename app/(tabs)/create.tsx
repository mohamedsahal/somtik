import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <IconSymbol name="camera.fill" size={40} color="#fff" />
          <ThemedText style={styles.optionText}>Camera</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.option}>
          <IconSymbol name="photo.fill" size={40} color="#fff" />
          <ThemedText style={styles.optionText}>Upload</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
}); 