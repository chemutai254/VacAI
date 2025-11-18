import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  googleId: string;
  phoneNumber?: string;
  location?: {
    latitude: number;
    longitude: number;
    county?: string;
    timestamp: number;
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasExistingProfile: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateLocation: () => Promise<void>;
  updatePhoneNumber: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_PROFILE_STORAGE_KEY = "@vaccine_village_user_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: Constants.expoConfig?.extra?.googleWebClientId,
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleResponse(response);
    }
  }, [response]);

  const loadUser = async () => {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        
        if (!profile.googleId || !profile.email || !profile.name) {
          console.log("Legacy profile detected, clearing for Google OAuth migration");
          await AsyncStorage.removeItem(USER_PROFILE_STORAGE_KEY);
          setHasExistingProfile(false);
          setUser(null);
        } else {
          setHasExistingProfile(true);
          setUser(profile);
        }
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    try {
      const { authentication } = response;
      if (!authentication?.accessToken) {
        console.error("No access token received");
        return;
      }

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );

      const userInfo = await userInfoResponse.json();

      const existingProfileJson = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      let newUser: User;

      if (existingProfileJson) {
        const existingProfile: User = JSON.parse(existingProfileJson);
        newUser = {
          ...existingProfile,
          email: userInfo.email,
          name: userInfo.name,
          profilePicture: userInfo.picture,
          googleId: userInfo.sub,
        };
      } else {
        newUser = {
          id: `user_${Date.now()}`,
          email: userInfo.email,
          name: userInfo.name,
          profilePicture: userInfo.picture,
          googleId: userInfo.sub,
          createdAt: new Date().toISOString(),
        };

        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            newUser.location = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: Date.now(),
            };
          }
        } catch (locationError) {
          console.log("Location capture failed during signup, continuing without location:", locationError);
        }
      }

      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setHasExistingProfile(true);
    } catch (error) {
      console.error("Failed to process Google sign-in:", error);
    }
  };

  const updateLocation = async () => {
    if (!user) {
      console.log("No user found, cannot update location");
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const updatedUser = {
        ...user,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: Date.now(),
        },
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to get location:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("Failed to initiate Google sign-in:", error);
      throw error;
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (!user) {
      console.log("No user found, cannot update phone number");
      return;
    }

    try {
      const updatedUser = {
        ...user,
        phoneNumber,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update phone number:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      setUser(null);
      setHasExistingProfile(false);
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        hasExistingProfile,
        signInWithGoogle,
        logout,
        updateLocation,
        updatePhoneNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
