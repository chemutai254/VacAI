import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { storage } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ChatStackParamList } from '@/navigation/ChatStackNavigator';

type ChatListNavigationProp = NativeStackNavigationProp<ChatStackParamList, 'ChatList'>;

interface ChatPreview {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  isPinned: boolean;
  unreadCount?: number;
}

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();
  const navigation = useNavigation<ChatListNavigationProp>();
  const [chats, setChats] = useState<ChatPreview[]>([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const chatHistory = await storage.getChatHistory();
    if (chatHistory.length > 0) {
      // Group messages into conversations
      const conversations: ChatPreview[] = [{
        id: 'default',
        title: 'Vaccine Assistant',
        lastMessage: chatHistory[chatHistory.length - 1]?.content || '',
        timestamp: chatHistory[chatHistory.length - 1]?.timestamp || Date.now(),
        isPinned: false,
      }];
      setChats(conversations);
    } else {
      setChats([]);
    }
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('ChatConversation', { chatId: 'new' });
  };

  const handleChatPress = (chatId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('ChatConversation', { chatId });
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes === 0 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <Pressable
      onPress={() => handleChatPress(item.id)}
      style={({ pressed }) => [styles.chatItemPressable, pressed && styles.pressed]}
    >
      <Card style={styles.chatItem}>
        <View style={styles.chatIconContainer}>
          <Feather name="message-circle" size={24} color={Colors.light.primary} />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <ThemedText style={styles.chatTitle}>{item.title}</ThemedText>
            <ThemedText style={styles.chatTime}>
              {formatTimestamp(item.timestamp)}
            </ThemedText>
          </View>
          <View style={styles.chatFooter}>
            <ThemedText style={styles.chatMessage} numberOfLines={1}>
              {item.lastMessage}
            </ThemedText>
            {item.unreadCount ? (
              <View style={styles.unreadBadge}>
                <ThemedText style={styles.unreadText}>{item.unreadCount}</ThemedText>
              </View>
            ) : null}
          </View>
        </View>
        {item.isPinned ? (
          <Feather name="bookmark" size={16} color={Colors.light.primary} />
        ) : null}
      </Card>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Feather name="message-circle" size={64} color={Colors.light.mediumGray} />
      </View>
      <ThemedText style={styles.emptyTitle}>No conversations yet</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Start a new chat to get vaccine information and answers
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: tabBarHeight + 80, // Extra space for FAB
          },
        ]}
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={handleNewChat}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: tabBarHeight + Spacing.xl,
            right: Spacing.xl,
          },
          pressed && styles.fabPressed,
        ]}
      >
        <Feather name="edit-3" size={24} color="#FFFFFF" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  chatItemPressable: {
    marginBottom: Spacing.md,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  chatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.mediumGray,
    marginRight: Spacing.sm,
  },
  unreadBadge: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabPressed: {
    opacity: 0.85,
  },
  pressed: {
    opacity: 0.7,
  },
});
