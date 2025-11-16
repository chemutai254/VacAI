import React from "react";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SavedScreen from "@/screens/SavedScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type SavedStackParamList = {
  Saved: undefined;
};

const Stack = createNativeStackNavigator<SavedStackParamList>();

export default function SavedStackNavigator() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions(colorScheme)}>
      <Stack.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          title: "Saved",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </Stack.Navigator>
  );
}
