import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import { themes } from './theme';

type ThemeName = 'light' | 'dark';

const ThemeContext = createContext(themes.light);

interface ThemeControllerData {
  themeName: ThemeName;

  toggleTheme: () => void;
}

const ThemeControllerContext =
  createContext({} as ThemeControllerData);

export const ThemeProvider = ({
  children,
}: PropsWithChildren) => {
  const [themeName, setThemeName] =
    useState<ThemeName>('light');

  const toggleTheme = () => {
    setThemeName((prev) =>
      prev === 'light' ? 'dark' : 'light'
    );
  };

  const theme = themes[themeName];

  return (
    <ThemeControllerContext.Provider
      value={{
        themeName,
        toggleTheme,
      }}
    >
      <ThemeContext.Provider value={theme}>
        {children}
      </ThemeContext.Provider>
    </ThemeControllerContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);

export const useThemeController = () =>
  useContext(ThemeControllerContext);