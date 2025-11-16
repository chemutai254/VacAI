import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  vaccine: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}

export default function CommunitiesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostVaccine, setNewPostVaccine] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // Sample posts - in production, load from backend/storage
    const samplePosts: CommunityPost[] = [
      {
        id: '1',
        author: 'Sarah M.',
        content: 'Just got my baby vaccinated at Kenyatta Hospital. The nurses were so helpful and answered all my questions. Highly recommend!',
        vaccine: 'BCG, Polio',
        timestamp: Date.now() - 3600000,
        likes: 12,
      },
      {
        id: '2',
        author: 'James K.',
        content: 'My son had his measles vaccine yesterday. He was a bit fussy for a few hours but is back to normal today. Stay strong parents!',
        vaccine: 'Measles',
        timestamp: Date.now() - 7200000,
        likes: 8,
      },
      {
        id: '3',
        author: 'Grace N.',
        content: 'PSA: The health center in Kibera is offering free vaccines this week. They open early at 7 AM!',
        vaccine: 'General',
        timestamp: Date.now() - 10800000,
        likes: 24,
      },
    ];
    setPosts(samplePosts);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please write your experience');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      author: user?.name || 'Anonymous',
      content: newPostContent.trim(),
      vaccine: newPostVaccine.trim() || 'General',
      timestamp: Date.now(),
      likes: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostVaccine('');
    setShowCreateModal(false);
  };

  const handleLikePost = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes === 0 ? 'Just now' : `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const renderPost = ({ item }: { item: CommunityPost }) => (
    <Card style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatar}>
            <Feather name="user" size={20} color={Colors.light.primary} />
          </View>
          <View>
            <ThemedText style={styles.authorName}>{item.author}</ThemedText>
            <ThemedText style={styles.postTime}>
              {formatTimestamp(item.timestamp)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.vaccineTag}>
          <Feather name="shield" size={12} color={Colors.light.primary} />
          <ThemedText style={styles.vaccineTagText}>{item.vaccine}</ThemedText>
        </View>
      </View>

      {/* Post Content */}
      <ThemedText style={styles.postContent}>{item.content}</ThemedText>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <Pressable
          onPress={() => handleLikePost(item.id)}
          style={styles.actionButton}
        >
          <Feather
            name={item.isLiked ? 'heart' : 'heart'}
            size={18}
            color={item.isLiked ? Colors.light.error : Colors.light.mediumGray}
            fill={item.isLiked ? Colors.light.error : 'none'}
          />
          <ThemedText
            style={[
              styles.actionText,
              item.isLiked && { color: Colors.light.error },
            ]}
          >
            {item.likes}
          </ThemedText>
        </Pressable>
      </View>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Feather name="users" size={64} color={Colors.light.mediumGray} />
      </View>
      <ThemedText style={styles.emptyTitle}>No community posts yet</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Be the first to share your vaccine experience
      </ThemedText>
    </View>
  );

  return (
    <ScreenScrollView
      contentContainerStyle={{
        paddingBottom: tabBarHeight + 80,
      }}
    >
      {/* Header Banner */}
      <Card style={styles.headerBanner}>
        <Feather name="users" size={24} color={Colors.light.primary} />
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Community Stories</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Share experiences and support each other
          </ThemedText>
        </View>
      </Card>

      <View style={styles.listContent}>
        {posts.length === 0 ? renderEmptyState() : posts.map((post) => (
          <View key={post.id}>{renderPost({ item: post })}</View>
        ))}
      </View>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setShowCreateModal(true);
        }}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: tabBarHeight + Spacing.xl,
            right: Spacing.xl,
          },
          pressed && styles.fabPressed,
        ]}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </Pressable>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ScreenKeyboardAwareScrollView
            contentContainerStyle={[
              styles.modalContainer,
              { backgroundColor: theme.backgroundRoot },
            ]}
          >
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Share Your Experience</ThemedText>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Vaccine Name (optional)</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: theme.text, backgroundColor: theme.backgroundDefault },
                  ]}
                  placeholder="e.g., BCG, Polio, Measles"
                  placeholderTextColor={Colors.light.mediumGray}
                  value={newPostVaccine}
                  onChangeText={setNewPostVaccine}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Your Experience</ThemedText>
                <TextInput
                  style={[
                    styles.textArea,
                    { color: theme.text, backgroundColor: theme.backgroundDefault },
                  ]}
                  placeholder="Share your vaccination experience to help others..."
                  placeholderTextColor={Colors.light.mediumGray}
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
              </View>

              <Pressable
                onPress={handleCreatePost}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.submitButtonPressed,
                ]}
              >
                <ThemedText style={styles.submitButtonText}>Post to Community</ThemedText>
              </Pressable>
            </View>
          </ScreenKeyboardAwareScrollView>
        </View>
      </Modal>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    margin: Spacing.lg,
    padding: Spacing.lg,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  postCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
  vaccineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  vaccineTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  postActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: 14,
    color: Colors.light.mediumGray,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    padding: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    borderRadius: BorderRadius.input,
    padding: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    borderRadius: BorderRadius.input,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.light.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
