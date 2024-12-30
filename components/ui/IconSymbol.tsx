// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
  'house.fill': 'home',
  'person.2.fill': 'group',
  'plus': 'add',
  'envelope.fill': 'chat',
  'person.fill': 'person',
  'heart.fill': 'favorite',
  'message.fill': 'forum',
  'broadcast.fill': 'live-tv',
  'chevron.left': 'chevron-left',
  'play.fill': 'play-arrow',
  'bookmark.fill': 'bookmark',
  'square.and.arrow.up.fill': 'share',
  'music.note': 'music-note',
  'magnifyingglass': 'search',
  'camera.fill': 'camera',
  'photo.fill': 'photo',
  'arrowshape.turn.up.right.fill': 'reply',
  'chat.bubble.fill': 'mail',
  'trophy.fill': 'emoji-events',
  'checkmark.seal.fill': 'verified',
} as const;

export type IconSymbolName = keyof typeof MAPPING;

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
