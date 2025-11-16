import React from "react";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResourcesScreen from "@/screens/ResourcesScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type ResourcesStackParamList = {
  Resources: undefined;
};

const Stack = createNativeStackNavigator<ResourcesStackParamList>();

export default function ResourcesStackNavigator() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions(colorScheme)}>
      <Stack.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          title: "Resources",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </Stack.Navigator>
  );
}
