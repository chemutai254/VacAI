import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import LandingScreen from "@/screens/LandingScreen";
import LanguageSelectionScreen from "@/screens/LanguageSelectionScreen";
import PrivacyConsentScreen from "@/screens/PrivacyConsentScreen";
import AuthScreen from "@/screens/AuthScreen";
import OfflineDownloadModal from "@/components/OfflineDownloadModal";
import { VaccinationStatsModal } from "@/components/VaccinationStatsModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { storage } from "@/utils/storage";
import { useAppStateCleanup } from "@/hooks/useAppStateCleanup";

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLanguageSelected } = useLanguage();
  const [showLanding, setShowLanding] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(!isLanguageSelected);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [showOfflineDownload, setShowOfflineDownload] = useState(false);
  const [showVaccinationStats, setShowVaccinationStats] = useState(false);
  const [isCheckingConsent, setIsCheckingConsent] = useState(true);
  const [isCheckingLanding, setIsCheckingLanding] = useState(true);

  useAppStateCleanup();

  useEffect(() => {
    setShowLanguageSelection(!isLanguageSelected);
  }, [isLanguageSelected]);

  useEffect(() => {
    checkLandingStatus();
    checkPrivacyConsent();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !showPrivacyConsent && !showLanguageSelection) {
      checkVaccinationStats();
      checkOfflineDownload();
    }
  }, [isAuthenticated, showPrivacyConsent, showLanguageSelection]);

  const checkLandingStatus = async () => {
    const hasSeenLanding = await storage.getHasSeenLanding();
    setShowLanding(!hasSeenLanding);
    setIsCheckingLanding(false);
  };

  const checkVaccinationStats = async () => {
    const hasSeenStats = await storage.getHasSeenVaccinationStats();
    if (!hasSeenStats) {
      setShowVaccinationStats(true);
    }
  };

  const checkPrivacyConsent = async () => {
    const consentValue = await storage.getDataConsent();
    const hasSetConsent = consentValue !== null;
    setShowPrivacyConsent(!hasSetConsent);
    setIsCheckingConsent(false);
  };

  const checkOfflineDownload = async () => {
    const downloaded = await storage.getOfflineDownloaded();
    const dismissed = await storage.getOfflinePromptDismissed();
    if (!downloaded && !dismissed) {
      setShowOfflineDownload(true);
    }
  };

  const handleDownloadOffline = async () => {
    await storage.setOfflineDownloaded(true);
    setShowOfflineDownload(false);
  };

  const handleSkipOffline = async () => {
    await storage.setOfflinePromptDismissed(true);
    setShowOfflineDownload(false);
  };

  const isLoading = authLoading || isCheckingConsent || isCheckingLanding;

  return (
    <>
      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : showLanding ? (
        <LandingScreen
          onGetStarted={async () => {
            await storage.setHasSeenLanding(true);
            setShowLanding(false);
          }}
        />
      ) : showLanguageSelection ? (
        <LanguageSelectionScreen
          onComplete={() => setShowLanguageSelection(false)}
        />
      ) : showPrivacyConsent ? (
        <PrivacyConsentScreen
          onComplete={() => setShowPrivacyConsent(false)}
        />
      ) : !isAuthenticated ? (
        <AuthScreen />
      ) : (
        <NavigationContainer>
          <MainTabNavigator />
        </NavigationContainer>
      )}
      {isAuthenticated && !isLoading && !showLanding && !showLanguageSelection && !showPrivacyConsent && (
        <>
          <OfflineDownloadModal
            visible={showOfflineDownload}
            onDownload={handleDownloadOffline}
            onSkip={handleSkipOffline}
          />
          <VaccinationStatsModal
            visible={showVaccinationStats}
            onClose={async () => {
              await storage.setHasSeenVaccinationStats(true);
              setShowVaccinationStats(false);
            }}
          />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <KeyboardProvider>
            <AuthProvider>
              <LanguageProvider>
                <AppContent />
              </LanguageProvider>
            </AuthProvider>
            <StatusBar style="auto" />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
