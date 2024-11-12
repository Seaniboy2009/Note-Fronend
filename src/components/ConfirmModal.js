import React from "react";

const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <p>
          {message || "Are you sure you want to make changes to this entry?"}
        </p>
        <div style={buttonContainerStyle}>
          <button onClick={onConfirm} style={confirmButtonStyle}>
            Yes
          </button>
          <button onClick={onClose} style={cancelButtonStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal styling
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "15px",
};

const confirmButtonStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  borderRadius: "3px",
};

const cancelButtonStyle = {
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  borderRadius: "3px",
};

export default ConfirmationModal;
