import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
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
  login: (phoneNumber: string, name: string) => Promise<void>;
  loginWithPhone: (phoneNumber: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateLocation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_PROFILE_STORAGE_KEY = "@vaccine_village_user_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (profileJson) {
        setHasExistingProfile(true);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
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

  const login = async (phoneNumber: string, name: string) => {
    try {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        phoneNumber,
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
        console.log("Location capture failed during login, continuing without location:", locationError);
      }

      await AsyncStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setHasExistingProfile(true);
    } catch (error) {
      console.error("Failed to signup:", error);
      throw error;
    }
  };

  const loginWithPhone = async (phoneNumber: string): Promise<boolean> => {
    try {
      const profileJson = await AsyncStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (!profileJson) {
        return false;
      }

      const profile: User = JSON.parse(profileJson);
      
      const normalizedInputPhone = phoneNumber.startsWith('+254') 
        ? phoneNumber 
        : phoneNumber.replace(/^0/, '+254');
      const normalizedProfilePhone = profile.phoneNumber.startsWith('+254')
        ? profile.phoneNumber
        : profile.phoneNumber.replace(/^0/, '+254');

      if (normalizedInputPhone !== normalizedProfilePhone) {
        return false;
      }

      setUser(profile);
      return true;
    } catch (error) {
      console.error("Failed to login with phone:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
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
        login,
        loginWithPhone,
        logout,
        updateLocation,
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
