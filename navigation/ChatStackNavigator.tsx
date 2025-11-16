import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatListScreen from "@/screens/ChatListScreen";
import ChatConversationScreen from "@/screens/ChatConversationScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export type ChatStackParamList = {
  ChatList: undefined;
  ChatConversation: { chatId: string };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions}>
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          title: "Chats",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
      <Stack.Screen
        name="ChatConversation"
        component={ChatConversationScreen}
        options={{
          title: "Vaccine Assistant",
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </Stack.Navigator>
  );
}
