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
  RedDark: {
    backgroundColor: "#100000",
    panelColor: "#240000",
    selectedColor: "#410004",
    border: "1px solid #410004",
    color: " #9d0913",
    altColor: "rgb(163, 31, 42)",
    hoverColor: " #a63c3a",
    textUnavailable: "#5c060a",
    toggleColor: "#410004",
    createButton: "#2f0000",
  },
  // RedLight: {
  //   backgroundColor: "#ffcccc",
  //   backgroundColorGradient: "#ff9999",
  //   panelColor: "#ffb3b3",
  //   border: "1px solid #ff6666",
  //   color: "#b30000",
  //   altColor: "#ff8080",
  //   hoverColor: "#ff4d4d",
  //   textUnavailable: "#e60000",
  //   toggleColor: "#ff6666",
  //   createButton: "#ff9999",
  // },
  BlueDark: {
    backgroundColor: "rgb(12, 40, 51)",
    panelColor: " #0F303D",
    selectedColor: "rgb(33, 101, 128)",
    border: "1px solid rgb(77, 109, 110)",
    color: "rgb(153, 200, 255)",
    altColor: "#265e70",
    hoverColor: "#a63c3a",
    textUnavailable: "#a3b3b4",
    toggleColor: "#265e70",
    createButton: "#3a6f81",
  },
  // BlueLight: {
  //   backgroundColor: " #cceeff",
  //   backgroundColor2: " #99ddff",
  //   panelColor: "#b3e6ff",
  //   border: "1px solid #66ccff",
  //   color: "#004d80",
  //   altColor: "#80d4ff",
  //   hoverColor: "#4db8ff",
  //   textUnavailable: "#0066cc",
  //   toggleColor: "#66ccff",
  //   createButton: "#99ddff",
  // },
  PurpleDark: {
    backgroundColor: "#4b1fa3",
    panelColor: "#6739c4",
    selectedColor: "#7a4bdb",
    border: "1px solid #a63c3a",
    color: "#e9b8ff",
    altColor: "#a63c3a",
    hoverColor: "#7830db",
    textUnavailable: "#9b86c1",
    toggleColor: "#7830db",
    createButton: "#5f39b5",
  },
  // PurpleLight: {
  //   backgroundColor: "#e6ccff",
  //   backgroundColorGradient: "#d1b3ff",
  //   panelColor: "#dabfff",
  //   border: "1px solid #b366ff",
  //   color: "#4d0099",
  //   altColor: "#c299ff",
  //   hoverColor: "#9933ff",
  //   textUnavailable: "#8000cc",
  //   toggleColor: "#b366ff",
  //   createButton: "#d1b3ff",
  // },
  GreenDark: {
    backgroundColor: " #002918",
    panelColor: "rgb(0, 61, 36)",
    selectedColor: "rgb(0, 50, 12)",
    border: "1px solid #004f4f",
    color: "#a3f7bf",
    altColor: "#72c59a",
    hoverColor: "#004f4f",
    textColor: "#ffffff",
    toggleColor: "#006666",
    createButton: " #002918",
  },
  // GreenLight: {
  //   backgroundColor: "#ccffcc",
  //   backgroundColorGradient: "#b3ffb3",
  //   panelColor: "#e6ffe6",
  //   border: "1px solid #66cc66",
  //   color: "#005900",
  //   altColor: "#99e699",
  //   hoverColor: "#4d994d",
  //   textColor: "#003300",
  //   toggleColor: "#66cc66",
  //   createButton: "#b3ffb3",
  // },
  BasicDark: {
    backgroundColor: "rgb(94, 94, 94)",
    panelColor: "rgb(58, 58, 58)",
    selectedColor: "rgb(136, 136, 136)",
    border: "1px solid rgb(126, 126, 126)",
    color: "rgb(0, 0, 0)",
    altColor: "#d0d0d0",
    hoverColor: "#cccccc",
    textUnavailable: "#b0b0b0",
    toggleColor: "#d0d0d0",
    createButton: "#ffffff",
  },
  BasicLight: {
    backgroundColor: " #ffffff",
    panelColor: "rgb(207, 214, 214)",
    selectedColor: " #f2f2f2",
    border: "1px solid #000000",
    color: "rgb(77, 77, 77)",
    altColor: "#e0e0e0",
    hoverColor: "#f2f2f2",
    textUnavailable: "#cccccc",
    toggleColor: "#e0e0e0",
    createButton: "#f9f9f9",
  },
  // BasicLessContrastDark: {
  //   backgroundColor: "#e0f0f0",
  //   backgroundColorGradient: "#f0f8f8", // Slightly lighter than #e0f0f0
  //   panelColor: "#f9f9f9",
  //   border: "1px solid #d0d0d0",
  //   color: "#333333",
  //   altColor: "#d0d0d0",
  //   hoverColor: "#cccccc",
  //   textUnavailable: "#b0b0b0",
  //   toggleColor: "#d0d0d0",
  //   createButton: "#f0f8f8",
  // },
  // BasicLessContrastLight: {
  //   backgroundColor: "#ffffff",
  //   backgroundColorGradient: "#f9f9f9",
  //   panelColor: "#ffffff",
  //   border: "1px solid #e0e0e0",
  //   color: "#666666",
  //   altColor: "#e0e0e0",
  //   hoverColor: "#f2f2f2",
  //   textUnavailable: "#cccccc",
  //   toggleColor: "#e0e0e0",
  //   createButton: "#f9f9f9",
  // },
};

export const ThemeProvider = ({ children }) => {
  const availableThemes = Object.keys(theme);
  const storedTheme = localStorage.getItem("theme");

  const [activeTheme, setActiveTheme] = useState(
    availableThemes.includes(storedTheme) ? storedTheme : "BlueDark"
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
