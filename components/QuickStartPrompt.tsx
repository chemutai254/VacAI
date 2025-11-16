import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import * as Haptics from "expo-haptics";

interface QuickStartPromptProps {
  text: string;
  onPress: (text: string) => void;
}

export default function QuickStartPrompt({ text, onPress }: QuickStartPromptProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(text);
  };

  return (
    <Pressable
      onPress={handlePress}
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
    backgroundColor: Colors.light.beige,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
  },
  text: {
    fontSize: 14,
    color: Colors.light.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
