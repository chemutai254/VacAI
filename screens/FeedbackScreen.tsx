import React, { useState } from 'react';
import { View, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { ScreenKeyboardAwareScrollView } from '@/components/ScreenKeyboardAwareScrollView';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/hooks/useTheme';
import { storage } from '@/utils/storage';
import * as Haptics from 'expo-haptics';

export default function FeedbackScreen() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (value: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('error'), t('pleaseSelectRating'));
      return;
    }

    setIsSubmitting(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const feedbackData = {
      rating,
      feedback,
      timestamp: Date.now(),
    };

    const existingFeedback = await storage.getFeedback();
    await storage.setFeedback([...existingFeedback, feedbackData]);

    Alert.alert(t('thankYou'), t('feedbackSubmitted'));
    
    setRating(0);
    setFeedback('');
    setIsSubmitting(false);
  };

  return (
    <ScreenKeyboardAwareScrollView
      contentContainerStyle={styles.container}
    >
      <Card style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
            <Feather name="star" size={32} color="#FFFFFF" />
          </View>
        </View>

        <ThemedText style={styles.title}>{t('rateApp')}</ThemedText>
        <ThemedText style={styles.description}>
          {t('rateAppDescription')}
        </ThemedText>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => handleRating(star)}
              style={({ pressed }) => [
                styles.starButton,
                pressed && styles.pressed,
              ]}
            >
              <Feather
                name={star <= rating ? 'star' : 'star'}
                size={40}
                color={star <= rating ? '#FFD700' : theme.border}
                fill={star <= rating ? '#FFD700' : 'transparent'}
              />
            </Pressable>
          ))}
        </View>

        {rating > 0 && (
          <ThemedText style={[styles.ratingText, { color: theme.primary }]}>
            {rating === 1 && t('ratingPoor')}
            {rating === 2 && t('ratingFair')}
            {rating === 3 && t('ratingGood')}
            {rating === 4 && t('ratingVeryGood')}
            {rating === 5 && t('ratingExcellent')}
          </ThemedText>
        )}
      </Card>

      <Card style={styles.card}>
        <ThemedText style={styles.feedbackTitle}>
          {t('shareFeedback')}
        </ThemedText>
        <ThemedText style={styles.feedbackDescription}>
          {t('shareFeedbackDescription')}
        </ThemedText>

        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.backgroundSecondary,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          placeholder={t('feedbackPlaceholder')}
          placeholderTextColor={theme.tabIconDefault}
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </Card>

      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting || rating === 0}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: theme.primary },
          (pressed || isSubmitting || rating === 0) && styles.submitButtonDisabled,
        ]}
      >
        <ThemedText style={styles.submitButtonText}>
          {t('submitFeedback')}
        </ThemedText>
      </Pressable>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  starButton: {
    padding: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  feedbackDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.md,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
});
