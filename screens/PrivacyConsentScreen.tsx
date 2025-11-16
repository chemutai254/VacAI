import React, { useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { storage } from "@/utils/storage";
import * as Haptics from "expo-haptics";

interface PrivacyConsentScreenProps {
  onComplete: () => void;
}

export default function PrivacyConsentScreen({ onComplete }: PrivacyConsentScreenProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [acceptedConsent, setAcceptedConsent] = useState<boolean | null>(null);

  const handleAccept = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await storage.setDataConsent(true);
    setAcceptedConsent(true);
    setTimeout(onComplete, 100);
  };

  const handleDecline = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await storage.setDataConsent(false);
    setAcceptedConsent(false);
    setTimeout(onComplete, 100);
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="shield" size={48} color={Colors.light.primary} />
          </View>
          <ThemedText style={styles.title}>
            {t("privacyConsentTitle")}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t("privacyConsentSubtitle")}
          </ThemedText>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Feather name="check-circle" size={20} color={Colors.light.success} />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoTitle}>
                {t("privacyWhatWeCollect")}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                {t("privacyWhatWeCollectDetails")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Feather name="lock" size={20} color={Colors.light.info} />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoTitle}>
                {t("privacyHowWeProtect")}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                {t("privacyHowWeProtectDetails")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Feather name="eye-off" size={20} color={Colors.light.warning} />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoTitle}>
                {t("privacyAnonymization")}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                {t("privacyAnonymizationDetails")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Feather name="user-x" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <ThemedText style={styles.infoTitle}>
                {t("privacyYourChoice")}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                {t("privacyYourChoiceDetails")}
              </ThemedText>
            </View>
          </View>
        </Card>

        <View style={styles.noteContainer}>
          <Feather name="info" size={16} color={Colors.light.info} />
          <ThemedText style={styles.noteText}>
            {t("privacyConsentNote")}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={handleAccept}
          style={({ pressed }) => [
            styles.acceptButton,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.acceptButtonText}>
            {t("privacyAccept")}
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={handleDecline}
          style={({ pressed }) => [
            styles.declineButton,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.declineButtonText}>
            {t("privacyDecline")}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${Colors.light.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  infoCard: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  infoSection: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  infoIconContainer: {
    paddingTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: `${Colors.light.info}15`,
    borderRadius: BorderRadius.card,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  acceptButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  declineButton: {
    backgroundColor: "transparent",
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  declineButtonText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
});
