import React, { useContext } from "react";
import { ThemeContext } from "../context/theme";
import { Toggle } from "./toggle";

export const DefaultFooter: React.FC = () => {
  const [darkMode, setDarkMode] = useContext(ThemeContext);

  return (
    <div className="bottom-0 w-full py-6 px-8 grid grid-cols-12 items-center">
      <div className="col-span-2"></div>
      <div className="col-span-8 text-center">
        <span className="font-medium">
          © {new Date().getFullYear()} PoddyMcPodface. All rights reserved
        </span>
      </div>
      <div className="col-span-2 flex justify-end">
        <Toggle
          enabled={darkMode}
          className="px-3 py-2 rounded-lg bg-white/30 dark:bg-black/80"
          leading="Dark Mode"
          srLabel="Dark Mode"
          onChange={(checked) => setDarkMode(checked)}
        />
      </div>
    </div>
  );
};
