import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Monitor, Moon, Sun } from "react-feather";
import { type AppThemeMode, useTheme } from "@/hooks/theme";

const themes: AppThemeMode[] = ["system", "dark", "light"];

export const DefaultFooter: React.FC = () => {
  const [theme, setTheme] = useTheme();

  const handleThemeSelection = (value: AppThemeMode) => {
    setTheme(value);
  };

  return (
    <div className="bottom-0 grid w-full grid-cols-12 items-center py-6 px-8">
      <div className="col-span-2"></div>
      <div className="col-span-8 text-center">
        <span className="font-medium">
          Copyright © {new Date().getFullYear()} Poddy McPodface. All rights reserved.
        </span>
      </div>
      <div className="col-span-2 flex justify-end">
        <div className="relative w-40">
          <Listbox value={theme.mode} onChange={handleThemeSelection}>
            <Transition
              as={Fragment}
              enter="transition ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition ease-out"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute bottom-10 max-h-96 w-full rounded-md bg-black/20 py-1 text-sm ring-1 ring-black ring-opacity-30 backdrop-blur-md focus:outline-none dark:bg-white/20 dark:ring-white dark:ring-opacity-30">
                {themes.map((theme) => (
                  <Listbox.Option
                    className={({ selected }) =>
                      `cursor-pointer select-none rounded-md px-3 py-2 transition-colors ${
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
            </Transition>
            <Listbox.Button className="relative w-full rounded-md bg-black/20 px-3 py-2 text-black backdrop-blur-md dark:bg-white/20 dark:text-white">
              <div className="flex items-center gap-3">
                <div>
                  <Monitor
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "system" && "h-0 opacity-0"
                    }`}
                  />
                  <Moon
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "dark" && "h-0 opacity-0"
                    }`}
                  />
                  <Sun
                    size={16}
                    className={`relative left-0 transition-opacity duration-300 ${
                      theme.mode !== "light" && "h-0 opacity-0"
                    }`}
                  />
                </div>
                <span className="block truncate text-sm capitalize">
                  {theme.mode} {theme.mode !== "system" || (theme.dark ? "(dark)" : "(light)")}
                </span>
              </div>
            </Listbox.Button>
          </Listbox>
        </div>
      </div>
    </div>
  );
};
