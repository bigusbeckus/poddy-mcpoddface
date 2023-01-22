import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME_ENTRY = "light";

const darkModeAtom = atom(true);

export const useTheme = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  useEffect(() => {
    const systemThemeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = ({ matches }: { matches: boolean }) => {
      if (matches) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    };

    const loadedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (loadedTheme) {
      // Manually set theme
      setDarkMode(loadedTheme !== LIGHT_THEME_ENTRY);
    } else {
      // Respect system preferences
      setDarkMode(systemThemeMediaQuery.matches);
      systemThemeMediaQuery.addEventListener("change", handleSystemThemeChange);
    }
  }, [setDarkMode]);

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

  return [darkMode, setTheme] as const;
};
