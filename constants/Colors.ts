/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#246EE9';
const tintColorDark = '#246EE9';

export const BRAND = {
  primary: '#246EE9',
  secondary: '#FFFFFF',
  accent: '#FFA23C',
  dark: {
    background: '#000000',
    surface: '#121212',
    border: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#EEEEEE',
  }
};

export default {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#888888',
    tabIconSelected: tintColorDark,
  },
};
