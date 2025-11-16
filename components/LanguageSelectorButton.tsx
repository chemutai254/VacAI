import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface LanguageSelectorButtonProps {
  currentLanguage: string;
  onPress: () => void;
}

export function LanguageSelectorButton({ currentLanguage, onPress }: LanguageSelectorButtonProps) {
  const languageNames: { [key: string]: string } = {
    en: 'English',
    sw: 'Kiswahili',
    ki: 'Gĩkũyũ',
    luo: 'Dholuo',
    kam: 'Kikamba',
    luy: 'Luhya',
    kln: 'Kalenjin',
    mij: 'Kimijikenda',
    so: 'Somali',
    tuk: 'Turkana',
    saq: 'Samburu',
    mas: 'Maa',
    ren: 'Rendille',
    emb: 'Embu',
    mer: 'Kimeru',
  };

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
      <Feather name="globe" size={20} color={Colors.light.primary} />
      <ThemedText style={styles.text}>
        {languageNames[currentLanguage] || 'English'}
      </ThemedText>
      <Feather name="chevron-down" size={20} color={Colors.light.mediumGray} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: Spacing.sm,
    marginRight: Spacing.sm,
    flex: 1,
    color: '#1A1A1A',
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
});
