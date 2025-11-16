import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ChatBubble from '@/components/ChatBubble';
import { WelcomeCard } from '@/components/WelcomeCard';
import { SuggestionChip } from '@/components/SuggestionChip';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, Spacing } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatbotService, ChatMessage } from '@/services/chatbot';
import { storage } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '@/navigation/ChatStackNavigator';

type ChatConversationNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatConversation'>;
type ChatConversationRouteProp = RouteProp<ChatStackParamList, 'ChatConversation'>;

export default function ChatConversationScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language } = useLanguage();
  const navigation = useNavigation<ChatConversationNavigationProp>();
  const route = useRoute<ChatConversationRouteProp>();
  const { chatId } = route.params || { chatId: 'default' };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  useEffect(() => {
    // Set header title
    navigation.setOptions({
      title: 'Vaccine Assistant',
    });
  }, [navigation]);

  const loadMessages = async () => {
    const history = await storage.getChatHistory();
    setMessages(history);
  };

  const saveMessages = async (newMessages: ChatMessage[]) => {
    await storage.setChatHistory(newMessages);
    setMessages(newMessages);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await chatbotService.sendMessage(
        inputText.trim(),
        language
      );

      const assistantMessage: ChatMessage = {
        ...response,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      await saveMessages(finalMessages);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to get response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionPress = (text: string) => {
    setInputText(text);
    handleSend();
  };

  const handleTopicPress = (topic: string) => {
    const questions: Record<string, string> = {
      baby: 'What vaccines does my baby need in Kenya?',
      safety: 'Are vaccines safe for children?',
      centers: 'Where can I get vaccines in Kenya?',
    };
    setInputText(questions[topic] || '');
    handleSend();
  };

  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <ThemedText style={styles.welcomeTitle}>
        Ask me anything about vaccines
      </ThemedText>
      <ThemedText style={styles.welcomeSubtitle}>
        Get trusted information about vaccinations in Kenya
      </ThemedText>

      {/* Topic Cards */}
      <View style={styles.topicCards}>
        <WelcomeCard
          title="Baby Vaccines"
          icon="heart"
          onPress={() => handleTopicPress('baby')}
        />
        <WelcomeCard
          title="Vaccine Safety"
          icon="shield"
          onPress={() => handleTopicPress('safety')}
        />
        <WelcomeCard
          title="Vaccination Centers"
          icon="map-pin"
          onPress={() => handleTopicPress('centers')}
        />
      </View>

      {/* Suggestion Chips */}
      <View style={styles.suggestionsContainer}>
        <ThemedText style={styles.suggestionsLabel}>Quick questions:</ThemedText>
        <View style={styles.suggestionsRow}>
          <SuggestionChip
            text="What vaccines are free in Kenya?"
            onPress={() => handleSuggestionPress('What vaccines are free in Kenya?')}
          />
          <SuggestionChip
            text="When should my baby get vaccines?"
            onPress={() =>
              handleSuggestionPress('When should my baby get vaccines?')
            }
          />
          <SuggestionChip
            text="Find nearby health center"
            onPress={() => handleSuggestionPress('Find nearby health center')}
          />
        </View>
      </View>
    </View>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <ChatBubble
      id={item.id}
      role={item.role}
      content={item.content}
      confidence={item.confidence}
      sources={item.sources}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={messages.length === 0 ? renderWelcome : null}
          contentContainerStyle={{
            paddingTop: Spacing.lg,
            paddingBottom: tabBarHeight + 80,
          }}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: false });
            }
          }}
        />

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: tabBarHeight }]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder={t('typeYourQuestion')}
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
                pressed && styles.sendButtonPressed,
              ]}
            >
              <Feather
                name="send"
                size={20}
                color={
                  !inputText.trim() || isLoading
                    ? Colors.light.mediumGray
                    : '#FFFFFF'
                }
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  welcomeContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.light.mediumGray,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  topicCards: {
    marginBottom: Spacing.xl,
  },
  suggestionsContainer: {
    marginBottom: Spacing.xl,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.light.mediumGray,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.light.backgroundDefault,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.light.chatBubbleBeige,
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.light.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.lightGray,
  },
  sendButtonPressed: {
    opacity: 0.7,
  },
});
