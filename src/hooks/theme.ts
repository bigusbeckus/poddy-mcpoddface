import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";

const PREFERS_DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME_ENTRY = "light";
const DARK_THEME_ENTRY = "dark";

// const darkModeAtom = atom(true);

export type AppThemeMode = "dark" | "light" | "system";
export type AppTheme = {
  dark: boolean;
  mode: AppThemeMode;
};

const themeAtom = atom<AppTheme>({
  dark: true,
  mode: "system",
});

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const bodyElement = document.querySelector("body");
    if (bodyElement) {
      if (theme.dark) {
        bodyElement.classList.add("dark");
      } else {
        bodyElement.classList.remove("dark");
      }
    }
  }, [theme]);

  function changeTheme(mode: AppThemeMode) {
    let newTheme: AppTheme | undefined;

    if (mode === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
      newTheme = {
        dark: window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches,
        mode: "system",
      };
    } else if (mode === "light") {
      localStorage.setItem(THEME_STORAGE_KEY, LIGHT_THEME_ENTRY);
      newTheme = {
        dark: false,
        mode,
      };
    } else if (mode === "dark") {
      localStorage.setItem(THEME_STORAGE_KEY, DARK_THEME_ENTRY);
      newTheme = {
        dark: true,
        mode,
      };
    }

    if (newTheme) {
      setTheme(newTheme);
    }
  }

  return [theme, changeTheme] as const;
};

export const useSystemThemeChangeListener = () => {
  const [theme, setTheme] = useTheme();

  // const handleSystemThemeChange = useCallback(() => {
  //   setTheme("system");
  // }, []);

  useEffect(() => {
    console.log("mount", theme.mode);
    const loadedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    console.log("loaded: ", loadedTheme);
    if (loadedTheme) {
      // Manually set theme
      console.log(
        "setLoaded: ",
        loadedTheme !== LIGHT_THEME_ENTRY ? "dark" : "light"
      );
      setTheme(loadedTheme !== LIGHT_THEME_ENTRY ? "dark" : "light");
    } else {
      // Respect system preferences
      const systemThemeMediaQuery = window.matchMedia(PREFERS_DARK_MEDIA_QUERY);
      const handleSystemThemeChange = () => setTheme("system");
      console.log(
        "setDefault: system,",
        systemThemeMediaQuery.matches ? "dark" : "light"
      );
      setTheme("system");
      systemThemeMediaQuery.addEventListener("change", handleSystemThemeChange);

      return () =>
        systemThemeMediaQuery.removeEventListener(
          "change",
          handleSystemThemeChange
        );
    }
  }, []);
};
