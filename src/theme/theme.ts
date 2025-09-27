import { customFonts } from "./fonts";


export type Theme = {
  colors: {
    primaryDark: string;
    primaryLight: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
    primaryBtn: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  fonts: typeof customFonts;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: object;
    h2: object;
    h3: object;
    h4: object;
    body: object;
    small: object;
    caption: object;
    heading: object;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    round: number;
  };
  shadows: {
    light: object;
    medium: object;
  };
};


export const LightTheme : Theme = {
  colors: {
    primaryDark: "#200122",
    primaryLight: "#108DC7",
    background: "#fff",
    primaryBtn: "#200122",
    textPrimary: "#000",
    textSecondary: "#666666",
    border: "#E0E0E0",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: "#2196F3",
  },
  fonts: customFonts,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    heading: {
      // lineHeight: 20,
      fontSize: 33,
      ...customFonts.heavy,
      color: "#000000",
    },
    h1: {
      fontSize: 28,
      ...customFonts.bold,
      color: "#000000",
    },
    h2: {
      fontSize: 22,
      ...customFonts.semiBold,
      color: "#000000",
    },
    h3: {
      fontSize: 18,
      ...customFonts.medium,
      color: "#000000",
    },
    h4: {
      fontSize: 16,
      ...customFonts.bold,
      color: "#000000",
    },
    body: {
      fontSize: 16,
      ...customFonts.regular,
      color: "#000000",
    },
    small: {
      fontSize: 14,
      ...customFonts.regular,
      color: "#919191",
    },
    caption: {
      fontSize: 12,
      ...customFonts.regular,
      color: "grey",
    },
  },
  radius: {
    sm: 6,
    md: 12,
    lg: 24,
    round: 999,
  },
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export const DarkTheme : Theme = {
  colors: {
    primaryDark: "#3b023fff",
    primaryLight: "#919191",
    background: "#200122",
    textPrimary: "#eee",
    textSecondary: "#919191",
    primaryBtn: "#108DC7",
    border: "#E0E0E0",
    success: "#4CAF50",
    error: "#F44336",
    warning: "#FFC107",
    info: "#2196F3",
  },
  fonts: customFonts,
  spacing: LightTheme.spacing,
  radius: LightTheme.radius,
  shadows: LightTheme.shadows,
  typography: {
    heading: {
      fontSize: 28,
      ...customFonts.heavy,
      color: "#EEEEEE",
    },
    h1: {
      fontSize: 28,
      ...customFonts.bold,
      color: "#EEEEEE",
    },
    h2: {
      fontSize: 22,
      ...customFonts.semiBold,
      color: "#EEEEEE",
    },
    h3: {
      fontSize: 18,
      ...customFonts.medium,
      color: "#EEEEEE",
    },
    h4: {
      fontSize: 16,
      ...customFonts.bold,
      color: "#000000",
    },
    body: {
      fontSize: 16,
      ...customFonts.regular,
      color: "#EEEEEE",
    },
    small: {
      fontSize: 14,
      ...customFonts.regular,
      color: "#919191",
    },
    caption: {
      fontSize: 12,
      ...customFonts.regular,
      color: "grey",
    },
  },
};
