import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { createReview, addReview } from '@/utils/reviews';

interface ReviewSubmissionFormProps {
  onSubmitSuccess?: () => void;
}

export function ReviewSubmissionForm({ onSubmitSuccess }: ReviewSubmissionFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = async (value: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit a review');
      return;
    }

    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    if (!feedback.trim()) {
      Alert.alert('Feedback Required', 'Please enter your feedback');
      return;
    }

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const review = createReview(user.id, user.name, isAnonymous, rating, feedback.trim());
      await addReview(review);

      setRating(0);
      setFeedback('');
      setIsAnonymous(false);

      Alert.alert('Success', 'Thank you for your feedback!');
      onSubmitSuccess?.();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={styles.container}>
      <ThemedText style={styles.title}>Share Your Feedback</ThemedText>
      <ThemedText style={styles.subtitle}>Help us improve Vaccine Village</ThemedText>

      <View style={styles.ratingContainer}>
        <ThemedText style={styles.label}>Rating</ThemedText>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => handleRatingPress(star)}
              disabled={isSubmitting}
            >
              <Feather
                name="star"
                size={32}
                color={star <= rating ? Colors.light.primary : Colors.light.mediumGray}
                style={[
                  styles.star,
                  star <= rating && { color: Colors.light.primary },
                ]}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>Your Feedback</ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              color: Colors.light.text,
              backgroundColor: Colors.light.backgroundDefault,
              borderColor: Colors.light.border,
            },
          ]}
          placeholder="Tell us about your experience with the app..."
          placeholderTextColor={Colors.light.mediumGray}
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!isSubmitting}
        />
      </View>

      <View style={styles.anonymousContainer}>
        <View style={styles.anonymousText}>
          <Feather name="eye-off" size={20} color={Colors.light.mediumGray} />
          <View style={styles.anonymousTextContent}>
            <ThemedText style={styles.label}>Post Anonymously</ThemedText>
            <ThemedText style={styles.anonymousDescription}>
              Your name will be hidden from other users
            </ThemedText>
          </View>
        </View>
        <Switch
          value={isAnonymous}
          onValueChange={(value) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsAnonymous(value);
          }}
          trackColor={{ false: Colors.light.mediumGray, true: Colors.light.primary }}
          thumbColor={Colors.light.buttonText}
          disabled={isSubmitting}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          {
            backgroundColor: Colors.light.primary,
            opacity: pressed || isSubmitting ? 0.7 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <ThemedText
          style={[styles.submitButtonText, { color: Colors.light.buttonText }]}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </ThemedText>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: Spacing.lg,
  },
  ratingContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  star: {
    marginRight: Spacing.xs,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  textInput: {
    minHeight: 100,
    padding: Spacing.md,
    borderRadius: BorderRadius.input,
    borderWidth: 1,
    fontSize: 16,
  },
  anonymousContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  anonymousText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  anonymousTextContent: {
    flex: 1,
  },
  anonymousDescription: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  submitButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
