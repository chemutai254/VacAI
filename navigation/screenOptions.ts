import { Platform, ColorSchemeName } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";

export const getCommonScreenOptions = (colorScheme: ColorSchemeName): NativeStackNavigationOptions => {
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
