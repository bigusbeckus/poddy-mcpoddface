import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { Toggle } from "../components/toggle";
import { NavBar } from "../components/nav";

export const HomeLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);

  return (
    <>
      <main className="h-full">
        <NavBar className="flex justify-between">
          <div className="bg-gray-900 text-primary_light-300 dark:bg-white/50 dark:text-gray-900 py-0 px-2 rounded-sm font-black align-middle">
            Poddy McPoddface
          </div>
          <Toggle
            enabled={darkMode}
            leading="Dark Mode"
            srLabel="Dark Mode"
            onChange={(checked) => setDarkMode(checked)}
          />
        </NavBar>
        <div>{children}</div>
      </main>
    </>
  );
};
