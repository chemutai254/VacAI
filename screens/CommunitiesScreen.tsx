import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ReviewSubmissionForm } from '@/components/ReviewSubmissionForm';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getAllReviews, Review } from '@/utils/reviews';

export default function CommunitiesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const allReviews = await getAllReviews();
    setReviews(allReviews);
  };

  const formatTimestamp = (timestamp: string) => {
    const now = Date.now();
    const reviewTime = new Date(timestamp).getTime();
    const diff = now - reviewTime;
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

  const renderReview = (review: Review) => (
    <Card key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.authorContainer}>
          <View style={styles.avatar}>
            <Feather 
              name={review.isAnonymous ? "eye-off" : "user"} 
              size={20} 
              color={Colors.light.primary} 
            />
          </View>
          <View>
            <ThemedText style={styles.authorName}>
              {review.isAnonymous ? 'Anonymous' : review.userName}
            </ThemedText>
            <ThemedText style={styles.reviewTime}>
              {formatTimestamp(review.createdAt)}
            </ThemedText>
          </View>
        </View>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Feather
              key={star}
              name="star"
              size={14}
              color={star <= review.rating ? Colors.light.primary : Colors.light.lightGray}
            />
          ))}
        </View>
      </View>

      <ThemedText style={styles.reviewContent}>{review.feedback}</ThemedText>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Feather name="message-circle" size={64} color={Colors.light.mediumGray} />
      </View>
      <ThemedText style={styles.emptyTitle}>No reviews yet</ThemedText>
      <ThemedText style={styles.emptyDescription}>
        Be the first to share your feedback about Vaccine Village
      </ThemedText>
    </View>
  );

  return (
    <ScreenScrollView
      contentContainerStyle={{
        paddingBottom: tabBarHeight + Spacing.xl,
      }}
    >
      <Card style={styles.headerBanner}>
        <Feather name="message-circle" size={24} color={Colors.light.primary} />
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Community Reviews</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Share your feedback and help us improve
          </ThemedText>
        </View>
      </Card>

      <View style={styles.listContent}>
        <ReviewSubmissionForm onSubmitSuccess={loadReviews} />
        
        {reviews.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <ThemedText style={styles.sectionTitle}>Recent Reviews</ThemedText>
            {reviews.map((review) => renderReview(review))}
          </>
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  reviewCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
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
  reviewTime: {
    fontSize: 12,
    color: Colors.light.mediumGray,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 22,
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
});
