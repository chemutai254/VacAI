import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ResourcesScreen from "@/screens/ResourcesScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type ResourcesStackParamList = {
  Resources: undefined;
};

const Stack = createNativeStackNavigator<ResourcesStackParamList>();

export default function ResourcesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
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
