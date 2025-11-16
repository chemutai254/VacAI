import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { storage } from "@/utils/storage";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [dataConsent, setDataConsent] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const consent = await storage.getDataConsent();
    setDataConsent(consent);
  };

  const toggleDataConsent = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDataConsent(value);
    await storage.setDataConsent(value);
  };

  const getCurrentLanguageName = () => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    return lang?.nativeName || "English";
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
        }}
      >
        <ThemedText style={styles.sectionTitle}>{t("language")}</ThemedText>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>
                {t("language")}
              </ThemedText>
              <ThemedText style={styles.settingValue}>
                {getCurrentLanguageName()}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={24} color={Colors.light.mediumGray} />
          </View>
        </Card>

        <ThemedText style={styles.sectionTitle}>
          {t("offlineContent")}
        </ThemedText>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>
                {t("downloadOfflineContent")}
              </ThemedText>
              <ThemedText style={styles.settingDescription}>
                Download translations and resources
              </ThemedText>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{
                false: Colors.light.lightGray,
                true: Colors.light.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>
                {t("storageUsed")}
              </ThemedText>
              <ThemedText style={styles.settingValue}>2.4 MB</ThemedText>
            </View>
          </View>
        </Card>

        <ThemedText style={styles.sectionTitle}>{t("privacy")}</ThemedText>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>
                {t("dataCollection")}
              </ThemedText>
              <ThemedText style={styles.settingDescription}>
                {t("dataCollectionDescription")}
              </ThemedText>
            </View>
            <Switch
              value={dataConsent}
              onValueChange={toggleDataConsent}
              trackColor={{
                false: Colors.light.lightGray,
                true: Colors.light.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <ThemedText style={styles.settingLabel}>
                {t("viewPrivacyPolicy")}
              </ThemedText>
              <Feather
                name="external-link"
                size={20}
                color={Colors.light.primary}
              />
            </View>
          </Card>
        </Pressable>

        <Pressable
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <ThemedText style={styles.settingLabel}>
                {t("viewTermsOfService")}
              </ThemedText>
              <Feather
                name="external-link"
                size={20}
                color={Colors.light.primary}
              />
            </View>
          </Card>
        </Pressable>

        <ThemedText style={styles.sectionTitle}>{t("about")}</ThemedText>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingLabel}>
                Vaccine Village
              </ThemedText>
              <ThemedText style={styles.settingValue}>
                {t("version")} 1.0.0
              </ThemedText>
            </View>
          </View>
        </Card>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Made for Kenyan communities
          </ThemedText>
          <ThemedText style={styles.footerText}>
            In partnership with Kenya MOH, WHO, and UNICEF
          </ThemedText>
        </View>
      </ScreenScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    color: Colors.light.darkGray,
  },
  settingCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.light.mediumGray,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.light.mediumGray,
    marginTop: Spacing.xs,
  },
  footer: {
    paddingVertical: Spacing.xxl,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.mediumGray,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
});
