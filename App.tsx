import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import LanguageSelectionScreen from "@/screens/LanguageSelectionScreen";
import PrivacyConsentScreen from "@/screens/PrivacyConsentScreen";
import AuthScreen from "@/screens/AuthScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { storage } from "@/utils/storage";

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLanguageSelected } = useLanguage();
  const [showLanguageSelection, setShowLanguageSelection] = useState(!isLanguageSelected);
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false);
  const [isCheckingConsent, setIsCheckingConsent] = useState(true);

  useEffect(() => {
    setShowLanguageSelection(!isLanguageSelected);
  }, [isLanguageSelected]);

  useEffect(() => {
    checkPrivacyConsent();
  }, []);

  const checkPrivacyConsent = async () => {
    const consentValue = await storage.getDataConsent();
    const hasSetConsent = consentValue !== null;
    setShowPrivacyConsent(!hasSetConsent);
    setIsCheckingConsent(false);
  };

  if (authLoading || isCheckingConsent) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (showLanguageSelection) {
    return (
      <LanguageSelectionScreen
        onComplete={() => setShowLanguageSelection(false)}
      />
    );
  }

  if (showPrivacyConsent) {
    return (
      <PrivacyConsentScreen
        onComplete={() => setShowPrivacyConsent(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
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
