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
  const [selectedTab, setSelectedTab] = useState<"bookmarks" | "messages" | "history">("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const bookmarks = await storage.getBookmarkedResources();
    const messages = await storage.getBookmarkedMessages();
    const history = await storage.getChatHistory();
    setBookmarkedIds(bookmarks);
    setBookmarkedMessages(messages);
    setChatHistory(history);
  };

  const toggleBookmark = async (resourceId: string) => {
    const newBookmarks = bookmarkedIds.filter((id) => id !== resourceId);
    setBookmarkedIds(newBookmarks);
    await storage.setBookmarkedResources(newBookmarks);
  };

  const removeBookmarkedMessage = async (messageId: string) => {
    const newBookmarks = bookmarkedMessages.filter((m) => m.id !== messageId);
    setBookmarkedMessages(newBookmarks);
    await storage.setBookmarkedMessages(newBookmarks);
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
          onPress={() => setSelectedTab("messages")}
          style={[
            styles.tab,
            selectedTab === "messages" && styles.activeTab,
          ]}
        >
          <ThemedText
            style={[
              styles.tabText,
              selectedTab === "messages" && styles.activeTabText,
            ]}
          >
            {t("bookmarkedMessages")}
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

        {selectedTab === "messages" && (
          <>
            {bookmarkedMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="message-square" size={64} color={Colors.light.mediumGray} />
                <ThemedText style={styles.emptyText}>
                  {t("noSavedItems")}
                </ThemedText>
              </View>
            ) : (
              bookmarkedMessages.map((message) => (
                <Card key={message.id} style={styles.messageCard}>
                  <View style={styles.messageHeader}>
                    <ThemedText style={styles.messageContent}>
                      {message.content}
                    </ThemedText>
                    <Pressable
                      onPress={() => removeBookmarkedMessage(message.id)}
                      style={styles.removeButton}
                    >
                      <Feather name="x" size={20} color={Colors.light.mediumGray} />
                    </Pressable>
                  </View>
                  {message.sources && message.sources.length > 0 && (
                    <View style={styles.sourcesContainer}>
                      <Feather name="book-open" size={14} color={Colors.light.mediumGray} />
                      <ThemedText style={styles.sourcesText}>
                        {message.sources.length} {message.sources.length === 1 ? t("source").toLowerCase() : t("sourcesTitle").toLowerCase()}
                      </ThemedText>
                    </View>
                  )}
                  <ThemedText style={styles.messageDate}>
                    {new Date(message.timestamp).toLocaleDateString()}
                  </ThemedText>
                </Card>
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
  messageCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  messageContent: {
    fontSize: 16,
    flex: 1,
    marginRight: Spacing.sm,
  },
  removeButton: {
    padding: Spacing.xs,
  },
  sourcesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sourcesText: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
  messageDate: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
});
