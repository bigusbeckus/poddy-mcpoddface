import { useEffect, useState } from "react";

const SETTINGS_STORAGE_KEY = "settings";

type Settings = {
  enablePlayerStats: boolean;
};

const defaultSettings: Settings = {
  enablePlayerStats: false,
};

export function useLocalSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const loadedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (loadedSettings) {
      setSettings(JSON.parse(loadedSettings));
    }
  }, []);

  function save() {
    if (settings !== defaultSettings) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }

  function setPlayerStats(enabled: boolean) {
    setSettings({
      ...settings,
      enablePlayerStats: enabled,
    });
    save();
  }

  return [settings, setPlayerStats] as const;
}
