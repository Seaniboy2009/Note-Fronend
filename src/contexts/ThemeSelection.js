import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const theme = {
  Cyberpunk: {
    backgroundColor: "#100000",
    pannelColor: "#240000",
    border: "1px solid #410004",
    color: "#9d0913",
    altColor: "#4b1fa3",
    hoverColor: "#a63c3a",
    textUnavailable: "#5c060a", // Slightly darker greyish red
    toggleColor: "#410004", // Background color when checkbox is toggled
  },
  Starfield: {
    backgroundColor: "#265e70",
    pannelColor: "#88c0c2",
    border: "1px solid #88c0c2",
    color: "#e5e9e6",
    altColor: "#265e70",
    hoverColor: "#a63c3a",
    textUnavailable: "#a3b3b4", // Slightly darker greyish cyan
    toggleColor: "#265e70", // Background color when checkbox is toggled
  },
  purple: {
    backgroundColor: "#4b1fa3",
    pannelColor: "#6739c4",
    border: "1px solid #a63c3a",
    color: "#e9b8ff",
    altColor: "#a63c3a",
    hoverColor: "#7830db",
    textUnavailable: "#9b86c1", // Slightly darker greyish purple
    toggleColor: "#7830db", // Background color when checkbox is toggled
  },
  green: {
    // New Green Theme
    backgroundColor: "#021428",
    pannelColor: "#002627",
    border: "1px solid #004f4f",
    color: "#a3f7bf",
    altColor: "#72c59a",
    hoverColor: "#004f4f",
    textColor: "#ffffff",
    toggleColor: "#006666",
  },
};

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(
    localStorage.getItem("theme") || "Cyberpunk"
  );

  useEffect(() => {
    const currentTheme = theme[activeTheme];
    document.body.style.backgroundColor = currentTheme.backgroundColor;
    document.body.style.color = currentTheme.color;
    localStorage.setItem("theme", activeTheme);
  }, [activeTheme]);

  const changeTheme = (newTheme) => {
    setActiveTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      theme,
      changeTheme,
      activeTheme,
    }),
    [activeTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
