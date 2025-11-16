import { Platform } from "react-native";

const maroon = "#800020";
const beige = "#F5F5DC";

export const Colors = {
  light: {
    primary: maroon,
    beige: beige,
    text: "#000000",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: maroon,
    link: maroon,
    backgroundRoot: "#FFFFFF",
    backgroundDefault: beige,
    backgroundSecondary: "#E0E0E0",
    backgroundTertiary: "#F5F5F5",
    darkGray: "#4A4A4A",
    mediumGray: "#9E9E9E",
    lightGray: "#E0E0E0",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
  },
  dark: {
    primary: maroon,
    beige: beige,
    text: "#FFFFFF",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: maroon,
    link: maroon,
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    darkGray: "#E0E0E0",
    mediumGray: "#9E9E9E",
    lightGray: "#4A4A4A",
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  inputHeight: 56,
  buttonHeight: 56,
  fabSize: 56,
  chatInputHeight: 80,
};

export const BorderRadius = {
  badge: 8,
  card: 12,
  button: 24,
  input: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
