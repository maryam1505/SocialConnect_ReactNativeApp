import { customFonts } from "./fonts";


export type Theme = {
  colors: {
    primaryDark: string;
    primaryLight: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    primaryBtn: string;
  };
  fonts: typeof customFonts;
};


export const LightTheme : Theme = {
    colors: {
        primaryDark: "#200122",
        primaryLight: "#108DC7",
        background: "#fff",
        textPrimary: "#000",
        textSecondary: "#919191",
        primaryBtn: "#200122"
    },
    fonts: customFonts,
};

export const DarkTheme : Theme = {
    colors: {
        primaryDark: "#3b023fff",
        primaryLight: "#919191",
        background: "#200122",
        textPrimary: "#eee",
        textSecondary: "#919191",
        primaryBtn: "#108DC7",
    },
    fonts: customFonts,
};
