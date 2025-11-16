import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import LanguageSelector from "@/components/LanguageSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_LANGUAGE } from "@/constants/languages";
import * as Haptics from "expo-haptics";

interface LanguageSelectionScreenProps {
  onComplete: () => void;
}

export default function LanguageSelectionScreen({ onComplete }: LanguageSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, setIsLanguageSelected, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || DEFAULT_LANGUAGE);

  const handleContinue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setLanguage(selectedLang);
    await setIsLanguageSelected(true);
    onComplete();
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>
            {t("languageSelectionTitle")}
          </ThemedText>
          <ThemedText style={styles.description}>
            {t("languageSelectionDescription")}
          </ThemedText>
        </View>

        <LanguageSelector
          selectedLanguage={selectedLang}
          onSelectLanguage={setSelectedLang}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.continueButtonText}>
            {t("continue")}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.light.darkGray,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  continueButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Spacing.buttonHeight,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
