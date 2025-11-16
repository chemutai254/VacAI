import { Platform, useColorScheme } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";

export const getCommonScreenOptions = (): NativeStackNavigationOptions => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    headerTitleAlign: "center",
    headerTransparent: false,
    headerBlurEffect: isDark ? "dark" : "light",
    gestureEnabled: true,
    gestureDirection: "horizontal",
    fullScreenGestureEnabled: isLiquidGlassAvailable() ? false : true,
  };
};
