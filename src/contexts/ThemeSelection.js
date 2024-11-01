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
    link: {
      active: "#9d0913",
      color: "#9d0913",
      hover: "#9d091a",
    },
  },
  Starfield: {
    backgroundColor: "#3b3e41",
    pannelColor: "#84a6aa",
    border: "1px solid #d73d00",
    color: "#d73d00",
    link: {
      active: "#d73d00",
      color: "#d73d00",
      hover: "#d73d00",
    },
    button: {
      backgroundColor: "#d73d00",
      color: "#d73d00",
    },
  },
  purple: {
    backgroundColor: "#4b1fa3",
    pannelColor: "#6739c4",
    border: "1px solid #a63c3a",
    color: "#9b1cba",
    link: {
      active: "#e38b4f",
      color: "#e38b4f",
      hover: "#e7b590",
    },
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
    console.log("Active theme: ", activeTheme);
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
