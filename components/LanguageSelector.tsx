import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
}: LanguageSelectorProps) {
  const { theme } = useTheme();

  const handleSelect = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectLanguage(code);
  };

  return (
    <View style={styles.container}>
      {SUPPORTED_LANGUAGES.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => handleSelect(lang.code)}
          style={({ pressed }) => [
            styles.languageButton,
            {
              backgroundColor:
                selectedLanguage === lang.code
                  ? Colors.light.primary
                  : theme.backgroundDefault,
              borderColor:
                selectedLanguage === lang.code
                  ? Colors.light.primary
                  : Colors.light.lightGray,
            },
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.languageContent}>
            <ThemedText
              style={[
                styles.nativeName,
                selectedLanguage === lang.code && { color: "#FFFFFF" },
              ]}
            >
              {lang.nativeName}
            </ThemedText>
            <ThemedText
              style={[
                styles.englishName,
                selectedLanguage === lang.code && { color: "#FFFFFF" },
              ]}
            >
              {lang.name}
            </ThemedText>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  languageButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.card,
    borderWidth: 2,
    minHeight: Spacing.buttonHeight,
    justifyContent: "center",
  },
  languageContent: {
    alignItems: "center",
  },
  nativeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  englishName: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  pressed: {
    opacity: 0.7,
  },
});
