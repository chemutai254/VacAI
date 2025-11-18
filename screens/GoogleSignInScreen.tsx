import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

export default function GoogleSignInScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
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
            Multilingual vaccine education for Kenyan communities
          </ThemedText>
        </View>

        <View style={styles.signInContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              {
                backgroundColor: Colors.light.backgroundDefault,
                borderColor: Colors.light.primary,
                opacity: pressed || isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.light.primary} />
            ) : (
              <>
                <View style={styles.googleIconContainer}>
                  <Feather
                    name="mail"
                    size={24}
                    color={Colors.light.primary}
                  />
                </View>
                <ThemedText
                  type="body"
                  style={[styles.googleButtonText, { color: Colors.light.primary }]}
                >
                  Sign in with Google
                </ThemedText>
              </>
            )}
          </Pressable>

          <View style={styles.infoContainer}>
            <Feather name="info" size={16} color={Colors.light.info} />
            <ThemedText style={styles.infoText}>
              Sign in securely with your Google account to access personalized vaccine information
            </ThemedText>
          </View>

          <View style={[styles.infoContainer, { backgroundColor: "rgba(128, 0, 32, 0.1)" }]}>
            <Feather name="map-pin" size={16} color={Colors.light.primary} />
            <ThemedText style={styles.infoText}>
              We may request your location to provide relevant health resources for your area
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl * 3,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.card,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
    color: Colors.light.primary,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    paddingHorizontal: Spacing.lg,
  },
  signInContainer: {
    width: "100%",
  },
  googleButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.button,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  googleIconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    opacity: 0.8,
  },
});
