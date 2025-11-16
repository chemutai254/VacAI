import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommunitiesScreen from "@/screens/CommunitiesScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type CommunitiesStackParamList = {
  Communities: undefined;
};

const Stack = createNativeStackNavigator<CommunitiesStackParamList>();

export default function CommunitiesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Communities"
        component={CommunitiesScreen}
        options={{
          title: "Communities",
        }}
      />
    </Stack.Navigator>
  );
}
