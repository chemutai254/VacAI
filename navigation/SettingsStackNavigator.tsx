import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "@/screens/SettingsScreen";
import FeedbackScreen from "@/screens/FeedbackScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type SettingsStackParamList = {
  Settings: undefined;
  Feedback: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: "Feedback",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </Stack.Navigator>
  );
}
