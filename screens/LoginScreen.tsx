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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reloadAppAsync } from "expo";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number");
      return;
    }

    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(phoneNumber.trim(), password);
      if (!success) {
        setError("Invalid phone number or password");
      }
    } catch (err) {
      setError("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await AsyncStorage.removeItem("@vaccine_village_user_profile");
      await AsyncStorage.removeItem("@vaccine_village_onboarding_completed");
      await AsyncStorage.removeItem("@vaccine_village_language");
      await reloadAppAsync();
    } catch (err) {
      console.error("Failed to reset app:", err);
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
              Welcome Back
            </ThemedText>
            <ThemedText type="body" style={styles.subtitle}>
              Log in to continue your vaccine education journey
            </ThemedText>
          </View>

          <View style={styles.form}>
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

            <View style={styles.inputContainer}>
              <Feather
                name="lock"
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
                    paddingRight: Spacing.xl + Spacing.lg,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={Colors.light.mediumGray}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={Colors.light.mediumGray}
                />
              </Pressable>
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
                  Log In
                </ThemedText>
              )}
            </Pressable>

            <View style={styles.infoContainer}>
              <Feather name="info" size={16} color={Colors.light.info} />
              <ThemedText style={styles.infoText}>
                Enter the phone number and password you used to sign up
              </ThemedText>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: Colors.light.primary,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={handleCreateAccount}
              disabled={isLoading}
            >
              <ThemedText
                type="body"
                style={[styles.secondaryButtonText, { color: Colors.light.primary }]}
              >
                Create New Account
              </ThemedText>
            </Pressable>
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
    opacity: 0.5,
    fontSize: 14,
  },
  secondaryButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.button,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  eyeIcon: {
    position: "absolute",
    right: Spacing.lg,
    top: Spacing.lg + 2,
    zIndex: 1,
  },
});
