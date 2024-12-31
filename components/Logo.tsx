import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export function Logo() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>SOMTIK</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    backgroundColor: '#ff2d55',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 