import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import ResourceCard from "@/components/ResourceCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { VACCINE_RESOURCES } from "@/constants/resources";
import { storage } from "@/utils/storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { ChatMessage } from "@/services/chatbot";

export default function SavedScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<"bookmarks" | "history">("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const bookmarks = await storage.getBookmarkedResources();
    const history = await storage.getChatHistory();
    setBookmarkedIds(bookmarks);
    setChatHistory(history);
  };

  const toggleBookmark = async (resourceId: string) => {
    const newBookmarks = bookmarkedIds.filter((id) => id !== resourceId);
    setBookmarkedIds(newBookmarks);
    await storage.setBookmarkedResources(newBookmarks);
  };

  const handleAskQuestion = () => {
    navigation.navigate("ChatTab");
  };

  const bookmarkedResources = VACCINE_RESOURCES.filter((r) =>
    bookmarkedIds.includes(r.id)
  );

  const userMessages = chatHistory.filter((m) => m.role === "user");

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabsContainer}>
        <Pressable
          onPress={() => setSelectedTab("bookmarks")}
          style={[
            styles.tab,
            selectedTab === "bookmarks" && styles.activeTab,
          ]}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "bookmarks" && styles.activeTabText,
            ]}
          >
            {t("bookmarks")}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab("history")}
          style={[
            styles.tab,
            selectedTab === "history" && styles.activeTab,
          ]}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "history" && styles.activeTabText,
            ]}
          >
            {t("chatHistory")}
          </ThemedText>
        </Pressable>
      </View>

      <ScreenScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl + 60,
        }}
      >
        {selectedTab === "bookmarks" && (
          <>
            {bookmarkedResources.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="bookmark" size={64} color={Colors.light.mediumGray} />
                <ThemedText style={styles.emptyText}>
                  {t("noSavedItems")}
                </ThemedText>
              </View>
            ) : (
              bookmarkedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isBookmarked={true}
                  onToggleBookmark={() => toggleBookmark(resource.id)}
                />
              ))
            )}
          </>
        )}

        {selectedTab === "history" && (
          <>
            {userMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={64} color={Colors.light.mediumGray} />
                <ThemedText style={styles.emptyText}>
                  {t("noSavedItems")}
                </ThemedText>
              </View>
            ) : (
              userMessages.reverse().map((message) => (
                <Card key={message.id} style={styles.historyCard}>
                  <ThemedText style={styles.historyText}>
                    {message.content}
                  </ThemedText>
                  <ThemedText style={styles.historyDate}>
                    {new Date(message.timestamp).toLocaleDateString()}
                  </ThemedText>
                </Card>
              ))
            )}
          </>
        )}
      </ScreenScrollView>

      <FloatingActionButton onPress={handleAskQuestion} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.mediumGray,
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.mediumGray,
    marginTop: Spacing.lg,
  },
  historyCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  historyText: {
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
});
