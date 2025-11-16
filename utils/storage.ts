import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  LANGUAGE: "@vaccine_village:language",
  LANGUAGE_SELECTED: "@vaccine_village:language_selected",
  BOOKMARKED_RESOURCES: "@vaccine_village:bookmarked_resources",
  BOOKMARKED_MESSAGES: "@vaccine_village:bookmarked_messages",
  CHAT_HISTORY: "@vaccine_village:chat_history",
  DATA_CONSENT: "@vaccine_village:data_consent",
  HOW_TO_USE_DISMISSED: "@vaccine_village:how_to_use_dismissed",
};

export const storage = {
  async getLanguage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(KEYS.LANGUAGE);
    } catch (error) {
      console.error("Error getting language:", error);
      return null;
    }
  },

  async setLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE, language);
    } catch (error) {
      console.error("Error setting language:", error);
    }
  },

  async getLanguageSelected(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.LANGUAGE_SELECTED);
      return value === "true";
    } catch (error) {
      console.error("Error getting language selected:", error);
      return false;
    }
  },

  async setLanguageSelected(selected: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LANGUAGE_SELECTED, String(selected));
    } catch (error) {
      console.error("Error setting language selected:", error);
    }
  },

  async getBookmarkedResources(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.BOOKMARKED_RESOURCES);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error getting bookmarked resources:", error);
      return [];
    }
  },

  async setBookmarkedResources(resourceIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.BOOKMARKED_RESOURCES,
        JSON.stringify(resourceIds)
      );
    } catch (error) {
      console.error("Error setting bookmarked resources:", error);
    }
  },

  async getChatHistory(): Promise<any[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error getting chat history:", error);
      return [];
    }
  },

  async setChatHistory(history: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error("Error setting chat history:", error);
    }
  },

  async getDataConsent(): Promise<boolean | null> {
    try {
      const value = await AsyncStorage.getItem(KEYS.DATA_CONSENT);
      if (value === null) return null;
      return value === "true";
    } catch (error) {
      console.error("Error getting data consent:", error);
      return null;
    }
  },

  async setDataConsent(consent: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DATA_CONSENT, String(consent));
    } catch (error) {
      console.error("Error setting data consent:", error);
    }
  },

  async getHowToUseDismissed(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEYS.HOW_TO_USE_DISMISSED);
      return value === "true";
    } catch (error) {
      console.error("Error getting how to use dismissed:", error);
      return false;
    }
  },

  async setHowToUseDismissed(dismissed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HOW_TO_USE_DISMISSED, String(dismissed));
    } catch (error) {
      console.error("Error setting how to use dismissed:", error);
    }
  },

  async getBookmarkedMessages(): Promise<string[]> {
    try {
      const value = await AsyncStorage.getItem(KEYS.BOOKMARKED_MESSAGES);
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error("Error getting bookmarked messages:", error);
      return [];
    }
  },

  async setBookmarkedMessages(messageIds: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        KEYS.BOOKMARKED_MESSAGES,
        JSON.stringify(messageIds)
      );
    } catch (error) {
      console.error("Error setting bookmarked messages:", error);
    }
  },
};
