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

type ConversationPair = {
  id: string;
  question: ChatMessage;
  answer: ChatMessage;
  timestamp: number;
};

export default function SavedScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  const [selectedTab, setSelectedTab] = useState<"bookmarks" | "messages" | "history">("bookmarks");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());

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

  const conversationPairs: ConversationPair[] = [];
  for (let i = 0; i < chatHistory.length - 1; i++) {
    if (chatHistory[i].role === "user" && chatHistory[i + 1].role === "assistant") {
      conversationPairs.push({
        id: chatHistory[i].id,
        question: chatHistory[i],
        answer: chatHistory[i + 1],
        timestamp: chatHistory[i].timestamp,
      });
    }
  }

  const toggleConversation = (id: string) => {
    setExpandedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
            {conversationPairs.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="message-circle" size={64} color={Colors.light.mediumGray} />
                <ThemedText style={styles.emptyText}>
                  {t("noSavedItems")}
                </ThemedText>
              </View>
            ) : (
              conversationPairs.reverse().map((pair) => {
                const isExpanded = expandedConversations.has(pair.id);
                return (
                  <Pressable
                    key={pair.id}
                    onPress={() => toggleConversation(pair.id)}
                  >
                    <Card style={styles.historyCard}>
                      <View style={styles.conversationHeader}>
                        <View style={styles.questionBadge}>
                          <ThemedText style={styles.badgeText}>Q</ThemedText>
                        </View>
                        <ThemedText 
                          style={styles.historyText} 
                          numberOfLines={isExpanded ? undefined : 2}
                        >
                          {pair.question.content}
                        </ThemedText>
                        <Feather 
                          name={isExpanded ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={Colors.light.mediumGray} 
                        />
                      </View>
                      
                      {isExpanded && (
                        <View style={styles.answerContainer}>
                          <View style={styles.answerHeader}>
                            <View style={styles.answerBadge}>
                              <ThemedText style={styles.badgeText}>A</ThemedText>
                            </View>
                            <ThemedText style={styles.answerLabel}>{t("response")}</ThemedText>
                          </View>
                          <ThemedText style={styles.answerText}>
                            {pair.answer.content}
                          </ThemedText>
                          {pair.answer.sources && pair.answer.sources.length > 0 && (
                            <View style={styles.sourcesContainer}>
                              <Feather name="book-open" size={14} color={Colors.light.mediumGray} />
                              <ThemedText style={styles.sourcesText}>
                                {pair.answer.sources.length} {pair.answer.sources.length === 1 ? t("source").toLowerCase() : t("sourcesTitle").toLowerCase()}
                              </ThemedText>
                            </View>
                          )}
                        </View>
                      )}
                      
                      <ThemedText style={styles.historyDate}>
                        {new Date(pair.timestamp).toLocaleDateString()}
                      </ThemedText>
                    </Card>
                  </Pressable>
                );
              })
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
  conversationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  questionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  answerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  historyText: {
    fontSize: 16,
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.light.mediumGray,
    marginTop: Spacing.sm,
  },
  answerContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.mediumGray,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.sm,
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
