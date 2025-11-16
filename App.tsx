import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import RootStackNavigator, { type RootStackParamList } from "@/navigation/RootStackNavigator";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAppStateCleanup } from "@/hooks/useAppStateCleanup";
import { useOnboardingState, type OnboardingPhase } from "@/hooks/useOnboardingState";

function AppContent() {
  const phase = useOnboardingState();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [isReady, setIsReady] = useState(false);
  const lastAppliedRoute = useRef<keyof RootStackParamList | null>(null);
  
  useAppStateCleanup();

  useEffect(() => {
    if (!isReady || !navigationRef.isReady()) return;

    const routeMap: Record<OnboardingPhase, keyof RootStackParamList> = {
      loading: 'Loading',
      landing: 'Landing',
      language: 'Language',
      consent: 'Consent',
      auth: 'Auth',
      login: 'Login',
      main: 'Main',
    };

    const targetRoute = routeMap[phase];
    
    if (targetRoute && lastAppliedRoute.current !== targetRoute) {
      lastAppliedRoute.current = targetRoute;
      navigationRef.reset({
        index: 0,
        routes: [{ name: targetRoute }],
      });
    }
  }, [phase, isReady, navigationRef]);

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => setIsReady(true)}
    >
      <RootStackNavigator phase={phase} />
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
