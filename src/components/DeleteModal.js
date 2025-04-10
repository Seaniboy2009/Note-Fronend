import React from "react";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../contexts/ThemeSelection";
const DeleteModal = ({ isOpen, onClose, onDelete, message }) => {
  const { theme, activeTheme } = useTheme();
  console.log("DeleteModal show:", isOpen);
  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: theme[activeTheme].panelColor,
    color: theme[activeTheme].color,
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "8px",
    zIndex: 1000,
  };

  return (
    <div style={modalOverlayStyle}>
      <p>{message || "No message"}</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <ThemedButton onClick={onDelete}>Delete</ThemedButton>
        <ThemedButton onClick={onClose}>Cancel</ThemedButton>
      </div>
    </div>
  );
};

export default DeleteModal;
