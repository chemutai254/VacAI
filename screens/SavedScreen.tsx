import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, Alert, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import FloatingActionButton from "@/components/FloatingActionButton";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [expandedConversations, setExpandedConversations] = useState<Set<string>>(new Set());

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const history = await storage.getChatHistory();
    setChatHistory(history);
  };

  const deleteConversation = async (conversationId: string) => {
    const newHistory = chatHistory.filter((m) => {
      if (m.role === "user" && m.id === conversationId) return false;
      if (m.role === "assistant") {
        const prevUserMsg = chatHistory[chatHistory.indexOf(m) - 1];
        if (prevUserMsg && prevUserMsg.id === conversationId) return false;
      }
      return true;
    });
    setChatHistory(newHistory);
    await storage.setChatHistory(newHistory);
  };

  const handleAskQuestion = () => {
    navigation.navigate("ChatTab");
  };

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

  const confirmDelete = (conversationId: string) => {
    Alert.alert(
      t("deleteConversation"),
      t("deleteConversationConfirm"),
      [
        {
          text: t("cancel"),
          style: "cancel"
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => deleteConversation(conversationId)
        }
      ]
    );
  };

  const renderRightActions = (conversationId: string) => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => confirmDelete(conversationId)}
    >
      <Feather name="trash-2" size={24} color="#FFFFFF" />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>{t("chatHistory")}</ThemedText>
      </View>

      <ScreenScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl + 60,
        }}
      >
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
              <Swipeable
                key={pair.id}
                renderRightActions={() => renderRightActions(pair.id)}
                overshootRight={false}
              >
                <Pressable onPress={() => toggleConversation(pair.id)}>
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
              </Swipeable>
            );
          })
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
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
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
  deleteButton: {
    backgroundColor: Colors.light.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
});
