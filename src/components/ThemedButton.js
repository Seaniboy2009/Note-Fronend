import React from "react";
import { useTheme } from "../contexts/ThemeSelection";

// Define sizes without specific `minWidth` for responsiveness
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
    cursor: "pointer", // Change cursor to pointer
    outline: "none", // Remove default focus outline
    transition: "background-color 0.3s ease, color 0.3s ease",
    width: "100%", // Make button width flexible to fill container
  };

  return (
    <button style={buttonStyle} {...props}>
      {children}
    </button>
  );
};

export default ThemedButton;
