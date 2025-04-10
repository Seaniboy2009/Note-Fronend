import React, { useState } from "react";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
const AddEntryModal = ({ isOpen, onClose, onCreate }) => {
  const userFirestore = useUser();
  const { theme, activeTheme } = useTheme();
  const [note, setNote] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default color
  const advancedFeatures = userFirestore?.advancedUser || false;
  if (!isOpen) return null; // Don't render the modal if it's not open

  const handleCreate = () => {
    onCreate({ note, color }); // Pass data back to parent
    setNote(""); // Clear input fields
    setColor("#ffffff");
    onClose(); // Close modal
  };

  return (
    <div
      style={{
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
      }}
    >
      <h5>Add New Entry</h5>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Enter your note here"
        style={{
          width: "100%",
          minHeight: "80px",
          marginBottom: "10px",
          padding: "8px",
          backgroundColor: theme[activeTheme].panelColor,
          color: theme[activeTheme].color,
          border: "1px solid",
          borderRadius: "4px",
        }}
      />
      {advancedFeatures && (
        <div style={{ marginBottom: "10px" }}>
          <label style={{ marginRight: "10px" }}>Select Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <ThemedButton onClick={handleCreate}>Create</ThemedButton>
        <ThemedButton onClick={onClose}>Cancel</ThemedButton>
      </div>
    </div>
  );
};

export default AddEntryModal;
