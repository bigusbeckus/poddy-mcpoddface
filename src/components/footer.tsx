import { Listbox } from "@headlessui/react";
import React, { useState } from "react";
import { AppThemeMode, useTheme } from "../hooks/theme";

const themes: AppThemeMode[] = ["system", "dark", "light"];

export const DefaultFooter: React.FC = () => {
  // const [darkMode, setDarkMode] = useContext(ThemeContext);
  const [theme, setTheme] = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme.mode);

  const handleThemeSelection = (value: AppThemeMode) => {
    setTheme(value);
    setSelectedTheme(value);
  };

  return (
    <div className="bottom-0 w-full py-6 px-8 grid grid-cols-12 items-center">
      <div className="col-span-2"></div>
      <div className="col-span-8 text-center">
        <span className="font-medium">
          Copyright © {new Date().getFullYear()} PoddyMcPodface. All rights
          reserved.
        </span>
      </div>
      <div className="col-span-2 flex justify-end">
        <div className="w-40 relative">
          <Listbox value={selectedTheme} onChange={handleThemeSelection}>
            <Listbox.Options className="w-full absolute bottom-10 max-h-96 py-1 rounded-md bg-black/20 dark:bg-white/20 ring-1 ring-black dark:ring-white ring-opacity-30 dark:ring-opacity-30 focus:outline-none text-sm">
              {themes.map((theme) => (
                <Listbox.Option
                  className={({ selected }) =>
                    `px-3 py-2 rounded-md cursor-pointer transition-colors select-none ${
                      selected
                        ? "bg-black/20 dark:bg-white/20"
                        : "hover:bg-black/10 hover:dark:bg-white/10"
                    }`
                  }
                  key={theme}
                  value={theme}
                >
                  <span className="capitalize">{theme}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
            <Listbox.Button className="relative w-full px-3 py-2 rounded-md text-black dark:text-white bg-black/20 dark:bg-white/20">
              <span className="block truncate text-sm capitalize">
                {selectedTheme}
              </span>
            </Listbox.Button>
          </Listbox>
        </div>
      </div>
    </div>
  );
};
