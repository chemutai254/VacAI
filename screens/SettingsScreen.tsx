import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, Switch, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import { storage } from "@/utils/storage";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, updateLocation } = useAuth();
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

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await logout();
          },
        },
      ]
    );
  };

  const handleUpdateLocation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateLocation();
      Alert.alert("Success", "Location updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update location. Please check your location permissions.");
    }
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
        <ThemedText style={styles.sectionTitle}>Profile</ThemedText>
        <Card style={styles.settingCard}>
          <View style={styles.profileSection}>
            <View style={styles.profileIcon}>
              <Feather name="user" size={32} color={Colors.light.primary} />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
              <ThemedText style={styles.profileDetail}>{user?.phoneNumber}</ThemedText>
              {user?.location ? (
                <ThemedText style={styles.profileDetail}>
                  Location: {user.location.latitude.toFixed(4)}, {user.location.longitude.toFixed(4)}
                </ThemedText>
              ) : null}
            </View>
          </View>
        </Card>

        <Pressable onPress={handleUpdateLocation}>
          <Card style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <ThemedText style={styles.settingLabel}>Update Location</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Get personalized health resources for your area
                </ThemedText>
              </View>
              <Feather name="map-pin" size={20} color={Colors.light.primary} />
            </View>
          </Card>
        </Pressable>

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

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: Colors.light.error,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="log-out" size={20} color="#FFFFFF" />
          <ThemedText style={[styles.logoutText, { color: "#FFFFFF" }]}>
            Sign Out
          </ThemedText>
        </Pressable>

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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  profileDetail: {
    fontSize: 14,
    color: Colors.light.mediumGray,
    marginBottom: Spacing.xs,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.button,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
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
