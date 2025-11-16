import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "@/screens/ChatScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import HeaderTitle from "@/components/HeaderTitle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type ChatStackParamList = {
  Chat: undefined;
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: () => <HeaderTitle />,
          headerTransparent: true,
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </Stack.Navigator>
  );
}
