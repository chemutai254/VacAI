import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "low";
  sources?: string[];
  onCiteSources?: () => void;
}

export default function ChatBubble({
  role,
  content,
  confidence,
  sources,
  onCiteSources,
}: ChatBubbleProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const isUser = role === "user";

  const handleListen = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.speak(content, {
      language: "en",
    });
  };

  const handleCiteSources = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCiteSources?.();
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: Colors.light.primary }
            : { backgroundColor: Colors.light.chatBubbleBeige },
        ]}
      >
        <ThemedText
          style={[styles.text, isUser && { color: "#FFFFFF" }]}
        >
          {content}
        </ThemedText>

        {!isUser && confidence && (
          <ConfidenceBadge level={confidence} />
        )}

        <View style={styles.actionsRow}>
          <Pressable
            onPress={handleListen}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
          >
            <Feather 
              name="volume-2" 
              size={16} 
              color={isUser ? "#FFFFFF" : Colors.light.primary} 
            />
            <ThemedText style={[
              styles.actionText, 
              isUser && styles.userActionText
            ]}>
              {t("listen")}
            </ThemedText>
          </Pressable>

          {!isUser && sources && sources.length > 0 && (
            <Pressable
              onPress={handleCiteSources}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
              ]}
            >
              <ThemedText style={styles.actionText}>
                {t("citeSources")}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  assistantContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: Spacing.md,
    borderRadius: BorderRadius.card,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  userActionText: {
    color: "#FFFFFF",
  },
  pressed: {
    opacity: 0.7,
  },
});
