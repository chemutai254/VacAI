import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import ChatBubble from "@/components/ChatBubble";
import QuickStartPrompt from "@/components/QuickStartPrompt";
import { WelcomeCard } from "@/components/WelcomeCard";
import { SuggestionChip } from "@/components/SuggestionChip";
import { LanguageSelectorButton } from "@/components/LanguageSelectorButton";
import LanguageSelector from "@/components/LanguageSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { sendChatMessage, detectUnsafeQuery, ChatMessage } from "@/services/chatbot";
import { storage } from "@/utils/storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showUnsafeWarning, setShowUnsafeWarning] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<ChatMessage[]>([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    loadChatHistory();
    checkHowToUseDismissed();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setInputText("");
    });

    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      loadBookmarkedMessages();
    }, [])
  );

  const loadChatHistory = async () => {
    const history = await storage.getChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  };

  const saveChatHistory = async (newMessages: ChatMessage[]) => {
    await storage.setChatHistory(newMessages.slice(-50));
  };

  const checkHowToUseDismissed = async () => {
    const dismissed = await storage.getHowToUseDismissed();
    setShowHowToUse(!dismissed);
  };

  const loadBookmarkedMessages = async () => {
    const bookmarked = await storage.getBookmarkedMessages();
    setBookmarkedMessages(bookmarked);
  };

  const toggleBookmark = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const isCurrentlyBookmarked = bookmarkedMessages.some(m => m.id === messageId);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedMessages.filter(m => m.id !== messageId)
      : [...bookmarkedMessages, message];
    
    setBookmarkedMessages(newBookmarks);
    await storage.setBookmarkedMessages(newBookmarks);
  };

  const dismissHowToUse = async () => {
    await storage.setHowToUseDismissed(true);
    setShowHowToUse(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    if (detectUnsafeQuery(inputText)) {
      setShowUnsafeWarning(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputText, language);
      const updatedMessages = [...newMessages, response];
      setMessages(updatedMessages);
      await saveChatHistory(updatedMessages);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Chat error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickPrompt = (text: string) => {
    setInputText(text);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleWelcomeCardPress = (topic: string) => {
    const topicQuestions: { [key: string]: string } = {
      babies: t("quickStartPrompt1"),
      safety: t("quickStartPrompt2"),
      locations: t("quickStartPrompt3"),
    };
    const question = topicQuestions[topic];
    if (question) {
      setInputText(question);
      setTimeout(() => {
        handleSend();
      }, 100);
    }
  };

  const handleCiteSources = (sources: string[]) => {
    setSelectedSources(sources);
    setShowSources(true);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.languageSelectorFixed, { top: insets.top + 60 + Spacing.md }]}>
        <LanguageSelectorButton currentLanguage={language} onPress={() => setShowLanguageModal(true)} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{
            paddingTop: insets.top + 60,
            paddingBottom: tabBarHeight + Spacing.chatInputHeight + Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <ThemedText style={styles.welcomeTitle}>
                {t("welcomeTitle")}
              </ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>
                {t("welcomeSubtitle")}
              </ThemedText>

              <View style={styles.topicCardsContainer}>
                <WelcomeCard
                  title={t("babyVaccines")}
                  icon="heart"
                  onPress={() => handleWelcomeCardPress("babies")}
                />
                <WelcomeCard
                  title={t("vaccineSafety")}
                  icon="shield"
                  onPress={() => handleWelcomeCardPress("safety")}
                />
                <WelcomeCard
                  title={t("vaccinationCenters")}
                  icon="map-pin"
                  onPress={() => handleWelcomeCardPress("locations")}
                />
              </View>

              <View style={styles.suggestionChipsContainer}>
                <SuggestionChip
                  text={t("quickStartPrompt1")}
                  onPress={() => handleQuickPrompt(t("quickStartPrompt1"))}
                />
                <SuggestionChip
                  text={t("quickStartPrompt2")}
                  onPress={() => handleQuickPrompt(t("quickStartPrompt2"))}
                />
                <SuggestionChip
                  text={t("quickStartPrompt3")}
                  onPress={() => handleQuickPrompt(t("quickStartPrompt3"))}
                />
                <SuggestionChip
                  text={t("quickStartPrompt4")}
                  onPress={() => handleQuickPrompt(t("quickStartPrompt4"))}
                />
              </View>
            </View>
          )}

          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              id={message.id}
              role={message.role}
              content={message.content}
              confidence={message.confidence}
              sources={message.sources}
              onCiteSources={() =>
                message.sources && handleCiteSources(message.sources)
              }
              isBookmarked={bookmarkedMessages.some(m => m.id === message.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.light.primary} />
              <ThemedText style={styles.loadingText}>{t("loading")}</ThemedText>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: tabBarHeight + Spacing.lg,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundRoot,
                color: theme.text,
              },
            ]}
            placeholder={t("typePlaceholder")}
            placeholderTextColor={Colors.light.mediumGray}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={({ pressed }) => [
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Feather
              name="send"
              size={20}
              color={inputText.trim() && !isLoading ? "#FFFFFF" : Colors.light.mediumGray}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showSources}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSources(false)}
      >
        <ThemedView
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top + Spacing.lg,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{t("sourcesTitle")}</ThemedText>
            <Pressable onPress={() => setShowSources(false)}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent}>
            {selectedSources.map((source, index) => (
              <Card key={index} style={styles.sourceCard}>
                <ThemedText style={styles.sourceText}>{source}</ThemedText>
              </Card>
            ))}
          </ScrollView>
        </ThemedView>
      </Modal>

      <Modal
        visible={showUnsafeWarning}
        animationType="fade"
        transparent
        onRequestClose={() => setShowUnsafeWarning(false)}
      >
        <View style={styles.warningOverlay}>
          <View
            style={[
              styles.warningCard,
              { backgroundColor: theme.backgroundRoot },
            ]}
          >
            <Feather name="alert-triangle" size={48} color={Colors.light.error} />
            <ThemedText style={styles.warningTitle}>
              {t("cannotAnswerSafely")}
            </ThemedText>
            <ThemedText style={styles.warningText}>
              {t("contactHealthFacility")}
            </ThemedText>
            <ThemedText style={styles.warningContact}>
              Kenya Ministry of Health: +254-20-2717077
            </ThemedText>
            <Pressable
              onPress={() => {
                setShowUnsafeWarning(false);
                setInputText("");
              }}
              style={({ pressed }) => [
                styles.warningButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.warningButtonText}>
                {t("close")}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <ThemedView
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top + Spacing.lg,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>{t("language")}</ThemedText>
            <Pressable onPress={() => setShowLanguageModal(false)}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView style={styles.modalContent}>
            <LanguageSelector
              selectedLanguage={language}
              onSelectLanguage={async (lang) => {
                await setLanguage(lang);
                setShowLanguageModal(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            />
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  howToUseContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  howToUseCard: {
    padding: Spacing.lg,
  },
  howToUseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  howToUseTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  howToUseText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.darkGray,
  },
  welcomeContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.darkGray,
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  topicCardsContainer: {
    marginBottom: Spacing.xl,
  },
  suggestionChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  quickPromptsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickPromptsTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  quickPrompts: {
    gap: Spacing.md,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.lightGray,
  },
  pressed: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
  },
  sourceCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sourceText: {
    fontSize: 14,
    lineHeight: 20,
  },
  warningOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  warningCard: {
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  warningText: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  warningContact: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  warningButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.button,
    minWidth: 120,
  },
  warningButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  languageSelectorFixed: {
    position: 'absolute',
    right: Spacing.lg,
    zIndex: 100,
    maxWidth: 200,
  },
});
