import React from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

interface VaccinationStatsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function VaccinationStatsModal({
  visible,
  onClose,
}: VaccinationStatsModalProps) {
  const { theme } = useTheme();

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const stats = [
    {
      icon: 'users' as const,
      value: '95%',
      label: 'Childhood Vaccination Coverage',
      color: Colors.light.success,
    },
    {
      icon: 'shield' as const,
      value: '47M',
      label: 'Kenyans Protected by Vaccines',
      color: Colors.light.info,
    },
    {
      icon: 'trending-up' as const,
      value: '89%',
      label: 'BCG Vaccine Coverage',
      color: Colors.light.primary,
    },
    {
      icon: 'check-circle' as const,
      value: '92%',
      label: 'Polio Vaccine Coverage',
      color: Colors.light.success,
    },
  ];

  const keyVaccines = [
    'BCG (Tuberculosis)',
    'Polio (OPV)',
    'Pentavalent (DPT-HepB-Hib)',
    'Pneumococcal Conjugate (PCV)',
    'Rotavirus',
    'Measles & Rubella',
    'Vitamin A',
    'Deworming',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.backgroundRoot },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerIcon}>
                <Feather
                  name="bar-chart-2"
                  size={24}
                  color={Colors.light.primary}
                />
              </View>
              <ThemedText style={styles.headerTitle}>
                Vaccination in Kenya
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Making communities healthier together
              </ThemedText>
            </View>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={theme.text} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Statistics Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <Card key={index} style={styles.statCard}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: `${stat.color}15` },
                    ]}
                  >
                    <Feather name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <ThemedText style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </ThemedText>
                  <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                </Card>
              ))}
            </View>

            {/* Key Vaccines */}
            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                Key Vaccines for Children
              </ThemedText>
              <View style={styles.vaccinesList}>
                {keyVaccines.map((vaccine, index) => (
                  <View key={index} style={styles.vaccineItem}>
                    <Feather
                      name="check"
                      size={16}
                      color={Colors.light.success}
                    />
                    <ThemedText style={styles.vaccineText}>{vaccine}</ThemedText>
                  </View>
                ))}
              </View>
            </Card>

            {/* Regional Information */}
            <Card style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                National Immunization Program
              </ThemedText>
              <ThemedText style={styles.sectionText}>
                Kenya's immunization program is one of the strongest in Africa,
                providing free vaccines to all children. The Kenya Expanded
                Programme on Immunization (KEPI) ensures vaccines are available
                at health facilities nationwide.
              </ThemedText>
            </Card>

            {/* Info Banner */}
            <View style={styles.infoBanner}>
              <Feather name="info" size={20} color={Colors.light.info} />
              <ThemedText style={styles.infoBannerText}>
                Vaccines are free at all public health facilities across Kenya.
                Visit your nearest health center for immunization.
              </ThemedText>
            </View>
          </ScrollView>

          {/* CTA Button */}
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}
          >
            <ThemedText style={styles.ctaButtonText}>
              Start Exploring
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: Spacing.xl,
    padding: Spacing.sm,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.light.mediumGray,
    lineHeight: 16,
  },
  section: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.light.mediumGray,
  },
  vaccinesList: {
    gap: Spacing.sm,
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  vaccineText: {
    fontSize: 14,
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.lg,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.light.info,
  },
  ctaButton: {
    backgroundColor: Colors.light.primary,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
  },
  ctaButtonPressed: {
    opacity: 0.85,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
