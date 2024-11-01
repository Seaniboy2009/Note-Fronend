import React from "react";
import { useTheme } from "../contexts/ThemeSelection";

const sizeStyles = {
  small: {
    padding: "4px 8px",
    fontSize: "12px",
    minWidth: "80px",
  },
  medium: {
    padding: "8px 16px",
    fontSize: "14px",
    minWidth: "100px",
  },
  large: {
    padding: "12px 24px",
    fontSize: "16px",
    minWidth: "200px",
  },
};

const ThemedButton = ({ children, size = "medium", ...props }) => {
  const { theme, activeTheme } = useTheme();

  // Get the button style based on the active theme
  const buttonStyle = {
    backgroundColor: theme[activeTheme].pannelColor,
    color: theme[activeTheme].color,
    borderColor: theme[activeTheme].color,
    border: "2px solid", // Ensure consistent border
    borderRadius: "4px", // Adjust the border radius to prevent concave effects
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    minWidth: sizeStyles[size].minWidth,
    cursor: "pointer", // Change cursor to pointer
    outline: "none", // Remove default focus outline
    transition: "background-color 0.3s ease, color 0.3s ease", //
  };

  return (
    <button style={buttonStyle} {...props}>
      {children}
    </button>
  );
};

export default ThemedButton;
