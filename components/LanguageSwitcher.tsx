import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import * as Haptics from "expo-haptics";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  const handleLanguageSelect = async (code: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLanguage(code);
    setModalVisible(false);
  };

  const handleOpenModal = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleCloseModal = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handleOpenModal}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
        ]}
      >
        <Feather name="globe" size={20} color={theme.primary} />
        <ThemedText style={styles.buttonText}>
          {currentLanguage?.nativeName || language}
        </ThemedText>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <ThemedView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              {t("selectLanguage")}
            </ThemedText>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Feather name="x" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                style={[
                  styles.languageItem,
                  lang.code === language && {
                    backgroundColor: theme.backgroundTertiary,
                  },
                ]}
              >
                <View style={styles.languageInfo}>
                  <ThemedText style={styles.languageName}>
                    {lang.nativeName}
                  </ThemedText>
                  <ThemedText style={styles.languageEnglish}>
                    {lang.name}
                  </ThemedText>
                </View>
                {lang.code === language && (
                  <Feather name="check" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    paddingTop: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  languageEnglish: {
    fontSize: 14,
    opacity: 0.6,
  },
});
