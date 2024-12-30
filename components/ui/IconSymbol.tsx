// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // See MaterialIcons here: https://icons.expo.fyi
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'plus.square.fill': 'add-box',
  'envelope.fill': 'mail',
  'person.fill': 'person',
  'heart.fill': 'favorite',
  'message.fill': 'message',
  'square.and.arrow.up.fill': 'share',
  'music.note': 'music-note',
  'camera.fill': 'camera',
  'photo.fill': 'photo',
  'play.fill': 'play-arrow',
  'broadcast.fill': 'live-tv',
  'person.2.fill': 'group',
  'plus': 'add',
  'bubble.right.fill': 'chat',
  'bookmark.fill': 'bookmark',
  'arrowshape.turn.up.right.fill': 'reply',
  'comment': 'comment',
  'xmark': 'close',
  'line.3.horizontal': 'menu',
  'grid': 'grid-on',
  'lock': 'lock',
  'chat.bubble.fill': 'chat-bubble-outline',
  'dot.radiowaves.left.and.right': 'wifi-tethering',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
