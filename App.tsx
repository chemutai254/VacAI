import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import LanguageSelectionScreen from "@/screens/LanguageSelectionScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function AppContent() {
  const { isLanguageSelected } = useLanguage();
  const [showLanguageSelection, setShowLanguageSelection] = useState(!isLanguageSelected);

  useEffect(() => {
    setShowLanguageSelection(!isLanguageSelected);
  }, [isLanguageSelected]);

  if (showLanguageSelection) {
    return (
      <LanguageSelectionScreen
        onComplete={() => setShowLanguageSelection(false)}
      />
    );
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
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
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
});
