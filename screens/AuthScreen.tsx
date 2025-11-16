import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(phoneNumber.trim(), name.trim());
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <View style={styles.header}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
            />
            <ThemedText type="h1" style={styles.title}>
              Vaccine Village
            </ThemedText>
            <ThemedText type="body" style={styles.subtitle}>
              Empowering communities with vaccine knowledge
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color={Colors.light.mediumGray}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.light.text,
                    backgroundColor: Colors.light.backgroundDefault,
                  },
                ]}
                placeholder="Your name"
                placeholderTextColor={Colors.light.mediumGray}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather
                name="phone"
                size={20}
                color={Colors.light.mediumGray}
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors.light.text,
                    backgroundColor: Colors.light.backgroundDefault,
                  },
                ]}
                placeholder="Phone number (e.g., 0712345678)"
                placeholderTextColor={Colors.light.mediumGray}
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError("");
                }}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={Colors.light.error} />
                <ThemedText style={[styles.errorText, { color: Colors.light.error }]}>
                  {error}
                </ThemedText>
              </View>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: Colors.light.primary,
                  opacity: pressed || isLoading ? 0.8 : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.buttonText} />
              ) : (
                <ThemedText
                  type="body"
                  style={[styles.buttonText, { color: Colors.light.buttonText }]}
                >
                  Get Started
                </ThemedText>
              )}
            </Pressable>

            <View style={styles.infoContainer}>
              <Feather name="info" size={16} color={Colors.light.info} />
              <ThemedText style={styles.infoText}>
                We'll request your location to provide relevant health resources for your area
              </ThemedText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl * 2,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.card,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: Spacing.lg,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: Spacing.lg,
    top: Spacing.lg + 2,
    zIndex: 1,
  },
  input: {
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.xl + Spacing.lg,
    borderRadius: BorderRadius.input,
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.button,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  buttonText: {
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    borderRadius: BorderRadius.card,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    opacity: 0.8,
  },
});
