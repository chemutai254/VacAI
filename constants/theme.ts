import { Platform } from "react-native";

const maroon = "#800020";
const beige = "#F5F5DC";

export const Colors = {
  light: {
    primary: maroon,
    beige: beige,
    text: "#1A1A1A",
    textSecondary: "#4A4A4A",
    buttonText: "#FFFFFF",
    tabIconDefault: "#7A7A7A",
    tabIconSelected: maroon,
    link: maroon,
    backgroundRoot: "#FAFAFA",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: beige,
    backgroundTertiary: "#F0F0F0",
    darkGray: "#2A2A2A",
    mediumGray: "#7A7A7A",
    lightGray: "#D0D0D0",
    success: "#2E7D32",
    warning: "#F57C00",
    error: "#C62828",
    info: "#1976D2",
    border: "#E0E0E0",
  },
  dark: {
    primary: "#A52A3D",
    beige: "#3D3428",
    text: "#F5F5F5",
    textSecondary: "#B0B0B0",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#C94A5C",
    link: "#C94A5C",
    backgroundRoot: "#1A1614",
    backgroundDefault: "#2A2420",
    backgroundSecondary: "#3D3428",
    backgroundTertiary: "#4A453A",
    darkGray: "#E0E0E0",
    mediumGray: "#9E9E9E",
    lightGray: "#4A4A4A",
    success: "#4CAF50",
    warning: "#FFA726",
    error: "#EF5350",
    info: "#42A5F5",
    border: "#3D3428",
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
