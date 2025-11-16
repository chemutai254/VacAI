import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { VaccineResource } from "@/constants/resources";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";

interface ResourceCardProps {
  resource: VaccineResource;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export default function ResourceCard({
  resource,
  isBookmarked,
  onToggleBookmark,
}: ResourceCardProps) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();

  const handleOpenUrl = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(resource.url);
  };

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleBookmark();
  };

  const getSourceBadgeColor = () => {
    switch (resource.source) {
      case "MOH":
        return Colors.light.primary;
      case "WHO":
        return "#0099CC";
      case "UNICEF":
        return "#00AEEF";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <View style={[styles.sourceBadge, { backgroundColor: getSourceBadgeColor() }]}>
          <ThemedText style={styles.sourceBadgeText}>
            {resource.source}
          </ThemedText>
        </View>
        <Pressable
          onPress={handleBookmark}
          style={({ pressed }) => [styles.bookmarkButton, pressed && styles.pressed]}
        >
          <Feather
            name={isBookmarked ? "bookmark" : "bookmark"}
            size={20}
            color={isBookmarked ? Colors.light.primary : Colors.light.mediumGray}
            fill={isBookmarked ? Colors.light.primary : "none"}
          />
        </Pressable>
      </View>

      <ThemedText style={styles.title}>
        {resource.title[language] || resource.title.en}
      </ThemedText>

      <ThemedText style={styles.summary}>
        {resource.summary[language] || resource.summary.en}
      </ThemedText>

      {resource.publishedDate && (
        <ThemedText style={styles.date}>
          {t("publishedDate")}: {resource.publishedDate}
        </ThemedText>
      )}

      <Pressable
        onPress={handleOpenUrl}
        style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
      >
        <ThemedText style={styles.linkText}>{t("viewSource")}</ThemedText>
        <Feather name="external-link" size={16} color={Colors.light.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sourceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.badge,
  },
  sourceBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  bookmarkButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  summary: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: Colors.light.mediumGray,
    marginBottom: Spacing.md,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  linkText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
