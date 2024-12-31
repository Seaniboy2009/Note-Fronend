import React from "react";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../contexts/ThemeSelection";
const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  const { theme, activeTheme } = useTheme();
  if (!show) return null;

  const modalOverlayStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme[activeTheme].pannelColor,
    color: theme[activeTheme].color,
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    zIndex: 1000,
  };

  return (
    <div style={modalOverlayStyle}>
      <p>{message || "Are you sure you want to make changes to this entry?"}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <ThemedButton onClick={onConfirm}>Yes</ThemedButton>
        <ThemedButton onClick={onClose}>Cancel</ThemedButton>
      </div>
    </div>
  );
};

export default ConfirmationModal;
