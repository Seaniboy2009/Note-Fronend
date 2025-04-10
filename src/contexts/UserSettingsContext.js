import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const UserSettingsContext = createContext();

// Create a provider component
export const UserSettingsProvider = ({ children }) => {
  const defaultSettings = {
    theme: "light",
    useIcons: false,
    notifications: false,
  };

  // Load settings from localStorage or fallback to defaults
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem("userSettings");
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};
