import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import ResourceCard from "@/components/ResourceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { Spacing } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { VACCINE_RESOURCES } from "@/constants/resources";
import { storage } from "@/utils/storage";
import { useNavigation } from "@react-navigation/native";

export default function ResourcesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const bookmarks = await storage.getBookmarkedResources();
    setBookmarkedIds(bookmarks);
  };

  const toggleBookmark = async (resourceId: string) => {
    const newBookmarks = bookmarkedIds.includes(resourceId)
      ? bookmarkedIds.filter((id) => id !== resourceId)
      : [...bookmarkedIds, resourceId];
    
    setBookmarkedIds(newBookmarks);
    await storage.setBookmarkedResources(newBookmarks);
  };

  const handleAskQuestion = () => {
    navigation.navigate("ChatTab");
  };

  const generalResources = VACCINE_RESOURCES.filter((r) => r.category === "general");
  const schedulesResources = VACCINE_RESOURCES.filter((r) => r.category === "schedules");
  const safetyResources = VACCINE_RESOURCES.filter((r) => r.category === "safety");

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl + 60,
        }}
      >
        <ThemedText style={styles.sectionTitle}>{t("generalInfo")}</ThemedText>
        {generalResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isBookmarked={bookmarkedIds.includes(resource.id)}
            onToggleBookmark={() => toggleBookmark(resource.id)}
          />
        ))}

        <ThemedText style={styles.sectionTitle}>{t("schedules")}</ThemedText>
        {schedulesResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isBookmarked={bookmarkedIds.includes(resource.id)}
            onToggleBookmark={() => toggleBookmark(resource.id)}
          />
        ))}

        <ThemedText style={styles.sectionTitle}>{t("safety")}</ThemedText>
        {safetyResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isBookmarked={bookmarkedIds.includes(resource.id)}
            onToggleBookmark={() => toggleBookmark(resource.id)}
          />
        ))}
      </ScreenScrollView>

      <FloatingActionButton onPress={handleAskQuestion} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
});
