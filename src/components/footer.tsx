import { Listbox } from "@headlessui/react";
import React from "react";
import { Monitor, Moon, Sun } from "react-feather";
import { AppThemeMode, useTheme } from "hooks/theme";

const themes: AppThemeMode[] = ["system", "dark", "light"];

export const DefaultFooter: React.FC = () => {
  const [theme, setTheme] = useTheme();

  const handleThemeSelection = (value: AppThemeMode) => {
    setTheme(value);
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
          <Listbox value={theme.mode} onChange={handleThemeSelection}>
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
              <div className="flex items-center gap-3">
                <div>
                  <Monitor
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "system" && "opacity-0 h-0"
                    }`}
                  />
                  <Moon
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "dark" && "opacity-0 h-0"
                    }`}
                  />
                  <Sun
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "light" && "opacity-0 h-0"
                    }`}
                  />
                </div>
                <span className="block truncate text-sm capitalize">
                  {theme.mode}{" "}
                  {theme.mode !== "system" ||
                    (theme.dark ? "(dark)" : "(light)")}
                </span>
              </div>
            </Listbox.Button>
          </Listbox>
        </div>
      </div>
    </div>
  );
};
