import React from 'react';
import { ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '@/screens/LandingScreen';
import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import PrivacyConsentScreen from '@/screens/PrivacyConsentScreen';
import GoogleSignInScreen from '@/screens/GoogleSignInScreen';
import MainTabNavigator from './MainTabNavigator';
import { MainPhaseEffects } from '@/components/MainPhaseEffects';
import { ThemedView } from '@/components/ThemedView';
import type { OnboardingPhase } from '@/hooks/useOnboardingState';

export type RootStackParamList = {
  Loading: undefined;
  Landing: undefined;
  Language: undefined;
  Consent: undefined;
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainScreenWrapperProps {
  phase: OnboardingPhase;
}

function MainScreenWrapper({ phase }: MainScreenWrapperProps) {
  return (
    <>
      <MainTabNavigator />
      {phase === 'main' && <MainPhaseEffects />}
    </>
  );
}

function LoadingScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

interface RootStackNavigatorProps {
  phase: OnboardingPhase;
}

export default function RootStackNavigator({ phase }: RootStackNavigatorProps) {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Language" component={LanguageSelectionScreen} />
      <Stack.Screen name="Consent" component={PrivacyConsentScreen} />
      <Stack.Screen name="Auth" component={GoogleSignInScreen} />
      <Stack.Screen name="Main">
        {() => <MainScreenWrapper phase={phase} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
