import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootStackNavigator';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { storage } from '@/utils/storage';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const handleGetStarted = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await storage.setHasSeenLanding(true);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Language' }],
    });
  };

  const features = [
    {
      icon: 'message-circle' as const,
      title: 'AI-Powered Chat',
      description: 'Get instant answers about vaccines in your language',
    },
    {
      icon: 'users' as const,
      title: 'Community Stories',
      description: 'Share experiences and learn from others',
    },
    {
      icon: 'shield' as const,
      title: 'Trusted Information',
      description: 'Kenya MOH, WHO, and UNICEF verified resources',
    },
    {
      icon: 'globe' as const,
      title: '15 Languages',
      description: 'Access vaccine info in your preferred language',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xxl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>Vaccine Village</ThemedText>
          <ThemedText style={styles.subtitle}>
            Empowering Kenyan communities with trusted vaccine knowledge
          </ThemedText>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Feather
                  name={feature.icon}
                  size={28}
                  color={Colors.light.primary}
                />
              </View>
              <ThemedText style={styles.featureTitle}>
                {feature.title}
              </ThemedText>
              <ThemedText style={styles.featureDescription}>
                {feature.description}
              </ThemedText>
            </Card>
          ))}
        </View>

        {/* Partners Section */}
        <View style={styles.partnersSection}>
          <ThemedText style={styles.partnersLabel}>Trusted by</ThemedText>
          <ThemedText style={styles.partnersText}>
            Kenya Ministry of Health • WHO • UNICEF
          </ThemedText>
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={handleGetStarted}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <ThemedText style={styles.ctaButtonText}>Get Started</ThemedText>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
    color: Colors.light.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.mediumGray,
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  featureCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.light.mediumGray,
    lineHeight: 18,
  },
  partnersSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  partnersLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.mediumGray,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  partnersText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.light.darkGray,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.button,
    gap: Spacing.sm,
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
