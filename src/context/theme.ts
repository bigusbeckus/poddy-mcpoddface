import { createContext, useEffect, useState } from "react";

type ThemeContextType = [
  darkMode: boolean,
  setDarkMode: (darkMode: boolean) => void
];

const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME_ENTRY = "light";

export const ThemeContext = createContext<ThemeContextType>([
  true,
  () => {
    return;
  },
]);

export function useThemeContextState(initial: boolean) {
  const [darkMode, setDarkMode] = useState(initial);

  useEffect(() => {
    const loadedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    setDarkMode(loadedTheme !== LIGHT_THEME_ENTRY);
  }, []);

  useEffect(() => {
    const bodyElement = document.querySelector("body");
    if (bodyElement) {
      if (darkMode) {
        bodyElement.classList.add("dark");
      } else {
        bodyElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  function setTheme(darkMode: boolean) {
    if (darkMode) {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, LIGHT_THEME_ENTRY);
    }
    setDarkMode(darkMode);
  }

  // theme = [darkMode, setTheme];
  return [darkMode, setTheme] as const;
}
