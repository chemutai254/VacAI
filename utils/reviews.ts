import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  isAnonymous: boolean;
  rating: number;
  feedback: string;
  createdAt: string;
}

const REVIEWS_STORAGE_KEY = '@vaccine_village_reviews';

export async function getAllReviews(): Promise<Review[]> {
  try {
    const reviewsJson = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!reviewsJson) {
      return [];
    }
    return JSON.parse(reviewsJson);
  } catch (error) {
    console.error('Failed to load reviews:', error);
    return [];
  }
}

export async function addReview(review: Review): Promise<void> {
  try {
    const reviews = await getAllReviews();
    reviews.unshift(review);
    await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error('Failed to save review:', error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const reviews = await getAllReviews();
    const filteredReviews = reviews.filter((r) => r.id !== reviewId);
    await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(filteredReviews));
  } catch (error) {
    console.error('Failed to delete review:', error);
    throw error;
  }
}

export function createReview(
  userId: string,
  userName: string,
  isAnonymous: boolean,
  rating: number,
  feedback: string
): Review {
  return {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    isAnonymous,
    rating,
    feedback,
    createdAt: new Date().toISOString(),
  };
}
