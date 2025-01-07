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
  Red: {
    backgroundColor: "#100000",
    panelColor: "#240000",
    border: "1px solid #410004",
    color: "#9d0913",
    altColor: "#4b1fa3",
    hoverColor: "#a63c3a",
    textUnavailable: "#5c060a",
    toggleColor: "#410004",
    createButton: "#4b1fa3",
  },
  Blue: {
    backgroundColor: "#265e70",
    panelColor: "#88c0c2",
    border: "1px solid #88c0c2",
    color: "#e5e9e6",
    altColor: "#265e70",
    hoverColor: "#a63c3a",
    textUnavailable: "#a3b3b4",
    toggleColor: "#265e70",
    createButton: "#265e70",
  },
  Purple: {
    backgroundColor: "#4b1fa3",
    panelColor: "#6739c4",
    border: "1px solid #a63c3a",
    color: "#e9b8ff",
    altColor: "#a63c3a",
    hoverColor: "#7830db",
    textUnavailable: "#9b86c1",
    toggleColor: "#7830db",
    createButton: "#7830db",
  },
  Green: {
    backgroundColor: "#021428",
    panelColor: "#002627",
    border: "1px solid #004f4f",
    color: "#a3f7bf",
    altColor: "#72c59a",
    hoverColor: "#004f4f",
    textColor: "#ffffff",
    toggleColor: "#006666",
    createButton: "#006666",
  },
  Basic: {
    backgroundColor: "#f9f9f9",
    panelColor: "#e0e0e0",
    border: "1px solid #d0d0d0",
    color: "#333333",
    altColor: "#d0d0d0",
    hoverColor: "#cccccc",
    textUnavailable: "#b0b0b0",
    toggleColor: "#d0d0d0",
    createButton: "#d0d0d0",
  },
  BasicLessContrast: {
    backgroundColor: "#e0f0f0",
    panelColor: "#f9f9f9",
    border: "1px solid #d0d0d0",
    color: "#333333",
    altColor: "#d0d0d0",
    hoverColor: "#cccccc",
    textUnavailable: "#b0b0b0",
    toggleColor: "#d0d0d0",
    createButton: "#d0d0d0",
  },
};

export const ThemeProvider = ({ children }) => {
  const availableThemes = Object.keys(theme);
  const storedTheme = localStorage.getItem("theme");

  const [activeTheme, setActiveTheme] = useState(
    availableThemes.includes(storedTheme) ? storedTheme : "Basic"
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
