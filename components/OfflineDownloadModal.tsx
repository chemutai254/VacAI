import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

type OfflineDownloadModalProps = {
  visible: boolean;
  onDownload: () => void;
  onSkip: () => void;
};

export default function OfflineDownloadModal({
  visible,
  onDownload,
  onSkip,
}: OfflineDownloadModalProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const handleDownload = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDownload();
  };

  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Card style={styles.modalCard}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
              <Feather name="download-cloud" size={32} color="#FFFFFF" />
            </View>
          </View>

          <ThemedText style={styles.title}>{t('offlineContent')}</ThemedText>
          <ThemedText style={styles.description}>
            {t('offlineDownloadDescription')}
          </ThemedText>

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Feather name="check-circle" size={20} color={theme.primary} />
              <ThemedText style={styles.infoText}>
                {t('offlineFeature1')}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <Feather name="check-circle" size={20} color={theme.primary} />
              <ThemedText style={styles.infoText}>
                {t('offlineFeature2')}
              </ThemedText>
            </View>
            <View style={styles.infoItem}>
              <Feather name="check-circle" size={20} color={theme.primary} />
              <ThemedText style={styles.infoText}>
                {t('offlineFeature3')}
              </ThemedText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleDownload}
              style={({ pressed }) => [
                styles.downloadButton,
                { backgroundColor: theme.primary },
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.downloadButtonText}>
                {t('downloadOfflineContent')}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleSkip}
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={[styles.skipButtonText, { color: theme.primary }]}>
                {t('skipForNow')}
              </ThemedText>
            </Pressable>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
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
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  infoList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  downloadButton: {
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
