import React from "react";
import { useTheme } from "../contexts/ThemeSelection";
import { Link } from "react-router-dom";
import appStyle from "../styles/App.module.css";
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

const ThemedCreateButton = ({ url = "/", link = true, onClick }) => {
  const { theme, activeTheme } = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Button styles based on the active theme
  const buttonStyle = {
    position: "fixed",
    height: "60px",
    width: "60px",
    borderRadius: "50%",
    bottom: "15%",
    right: "3%",
    fontSize: "80%",
    zIndex: "2",
    backgroundColor: theme[activeTheme].createButton,
    color: theme[activeTheme].color,
    border: "none",
  };

  return link ? (
    <Link to={url}>
      <button
        className={appStyle.ButtonCreate}
        style={{
          ...buttonStyle,
        }}
      >
        <i className="fa-sharp fa-solid fa-plus" />
      </button>
    </Link>
  ) : (
    <button
      className={appStyle.ButtonCreate}
      style={{
        ...buttonStyle,
      }}
      onClick={handleClick}
    >
      <i className="fa-sharp fa-solid fa-plus" />
    </button>
  );
};

export default ThemedCreateButton;
