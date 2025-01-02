import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor('background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
