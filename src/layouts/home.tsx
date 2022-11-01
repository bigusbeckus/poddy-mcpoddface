import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { Toggle } from "../components/toggle";
import { NavBar } from "../components/nav";
import Link from "next/link";

export const HomeLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);

  return (
    <>
      <main className="h-full flex flex-col">
        <NavBar className="w-screen flex justify-between fixed top-0  z-10">
          <Link href="/">
            <div className="bg-gray-900 text-primary_light-300 dark:bg-white/50 dark:text-gray-900 py-0 px-2 rounded-sm font-black align-middle cursor-pointer">
              Poddy McPoddface
            </div>
          </Link>
          <Toggle
            enabled={darkMode}
            leading="Dark Mode"
            srLabel="Dark Mode"
            onChange={(checked) => setDarkMode(checked)}
          />
        </NavBar>
        <div className="h-full flex flex-col">
          <div className="h-16"></div>
          <div className="flex-1 overflow-y-scroll">{children}</div>
        </div>
      </main>
    </>
  );
};
