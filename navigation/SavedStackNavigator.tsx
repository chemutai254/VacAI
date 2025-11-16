import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SavedScreen from "@/screens/SavedScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type SavedStackParamList = {
  Saved: undefined;
};

const Stack = createNativeStackNavigator<SavedStackParamList>();

export default function SavedStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          title: "Saved",
        }}
      />
    </Stack.Navigator>
  );
}
