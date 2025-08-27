import { DefaultTheme, DarkTheme as NavigationDark, Theme as NavigationTheme } from "@react-navigation/native";
import { DarkTheme, LightTheme } from "./theme";

export const NavigationLightTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: LightTheme.colors.primaryLight,
    background: LightTheme.colors.background,
    card: LightTheme.colors.background,
    text: LightTheme.colors.textPrimary,
    border: "#ddd",
    notification: LightTheme.colors.primaryLight,
  },
};

export const NavigationDarkTheme: NavigationTheme = {
  ...NavigationDark,
  colors: {
     ...NavigationDark.colors,
    primary: DarkTheme.colors.primaryLight,
    background: DarkTheme.colors.background,
    card: DarkTheme.colors.background,
    text: DarkTheme.colors.textPrimary,
    border: "#444",
    notification: DarkTheme.colors.primaryLight,
  },
};