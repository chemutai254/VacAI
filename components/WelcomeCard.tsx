import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface WelcomeCardProps {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

export function WelcomeCard({ title, icon, onPress }: WelcomeCardProps) {
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
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={28} color="#FFFFFF" />
        </View>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    backgroundColor: Colors.light.primary,
  },
  content: {
    padding: Spacing.lg,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
});
