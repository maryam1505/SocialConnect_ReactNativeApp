import { createContext, ReactNode, useContext, useState } from 'react';
import { DarkTheme, LightTheme } from '../theme/theme';
import {
  NavigationDarkTheme,
  NavigationLightTheme,
} from '../theme/navigationTheme';
import { Theme as AppTheme } from '../theme/theme';
import { Theme as NavigationTheme } from '@react-navigation/native';

type ThemeContextType = {
  appTheme: AppTheme;
  navigationTheme: NavigationTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const appTheme = isDarkMode ? DarkTheme : LightTheme;
  const navigationTheme = isDarkMode
    ? NavigationDarkTheme
    : NavigationLightTheme;

  return (
    <ThemeContext.Provider
      value={{ appTheme, navigationTheme, isDarkMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
