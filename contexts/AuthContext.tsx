import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

interface User {
  id: string;
  name: string;
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
  updateLocation: () => Promise<void>;
  updatePhoneNumber: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_PROFILE_STORAGE_KEY = "@vaccine_village_user_profile";

const createGuestUser = (): User => ({
  id: `guest_${Date.now()}`,
  name: "Guest User",
  createdAt: new Date().toISOString(),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        setUser(profile);
      } else {
        const guestUser = createGuestUser();
        
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            guestUser.location = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              timestamp: Date.now(),
            };
          }
        } catch (locationError) {
          console.log("Location capture skipped, continuing without location:", locationError);
        }

        await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(guestUser));
        setUser(guestUser);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      const guestUser = createGuestUser();
      setUser(guestUser);
    } finally {
      setIsLoading(false);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: true,
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
