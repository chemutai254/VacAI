import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface SuggestionChipProps {
  text: string;
  onPress: () => void;
}

export function SuggestionChip({ text, onPress }: SuggestionChipProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <ThemedText style={styles.text}>{text}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
});
