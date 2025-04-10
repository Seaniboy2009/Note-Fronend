import React from "react";
import { useTheme } from "../contexts/ThemeSelection";

// Define sizes for buttons
const sizeStyles = {
  small: {
    padding: "4px 8px",
    fontSize: "12px",
  },
  medium: {
    padding: "8px 16px",
    fontSize: "14px",
  },
  large: {
    padding: "12px 24px",
    fontSize: "16px",
  },
};

const ThemedButton = ({
  children,
  size = "medium",
  fullWidth = true,
  ...props
}) => {
  const { theme, activeTheme } = useTheme();

  // Button styles based on the active theme
  const buttonStyle = {
    backgroundColor: theme[activeTheme].panelColor,
    color: theme[activeTheme].color,
    borderColor: theme[activeTheme].color,
    border: "1px solid",
    borderRadius: "2px",
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    cursor: "pointer",
    outline: "none",
    transition: "background-color 0.3s ease, color 0.3s ease",
    width: fullWidth ? "100%" : "auto",
  };

  const hoverFocusStyle = {
    ":hover": {
      backgroundColor: "red",
    },
    ":focus": {
      outline: "2px solid",
      outlineColor: theme[activeTheme].color,
    },
  };

  return (
    <button
      style={{
        ...buttonStyle,
        ...hoverFocusStyle,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemedButton;
