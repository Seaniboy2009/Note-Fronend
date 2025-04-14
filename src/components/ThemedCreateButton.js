import React from "react";
import { useTheme } from "../contexts/ThemeSelection";
import { Link } from "react-router-dom";
import appStyle from "../styles/App.module.css";
// Define sizes for buttons

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
    height: "70px",
    width: "70px",
    borderRadius: "50%",
    bottom: "10%",
    right: "3%",
    fontSize: "120%",
    zIndex: "2",
    backgroundColor: theme[activeTheme].createButton,
    color: theme[activeTheme].color,
    border: "1px solid",
    padding: "0",
    alignItems: "center",
    textAlign: "center",
  };

  return link ? (
    <Link to={url}>
      <button
        style={{
          ...buttonStyle,
        }}
      >
        <p
          style={{
            margin: "0",
            alignItems: "center",
            fontSize: "150%",
            paddingBottom: "5px",
          }}
        >
          +
        </p>
      </button>
    </Link>
  ) : (
    <button
      style={{
        ...buttonStyle,
      }}
      onClick={handleClick}
    >
      <p style={{ margin: "0", alignItems: "center", fontSize: "100%" }}>+</p>
    </button>
  );
};

export default ThemedCreateButton;
