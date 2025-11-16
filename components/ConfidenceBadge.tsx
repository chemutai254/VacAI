import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low";
}

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const getBackgroundColor = () => {
    switch (level) {
      case "high":
        return Colors.light.success;
      case "medium":
        return Colors.light.warning;
      case "low":
        return Colors.light.error;
    }
  };

  const getLabel = () => {
    switch (level) {
      case "high":
        return t("high");
      case "medium":
        return t("medium");
      case "low":
        return t("low");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <ThemedText style={styles.text}>
        {t("confidence")}: {getLabel()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.badge,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
