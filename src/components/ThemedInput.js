import React from "react";
import { useTheme } from "../contexts/ThemeSelection";
import { Col, Row } from "react-bootstrap";

const ThemedInput = ({
  id,
  type,
  placeholder = "Type here...",
  value,
  onChange,
  border,
  label,
}) => {
  const { theme, activeTheme } = useTheme();
  const inputId = id || `themed-input-${Math.random()}`;

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const withLabel = (
    <Row>
      <Col>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              display: "block",
              marginBottom: "5px",
              color: theme[activeTheme].textColor,
              fontWeight: "bold",
            }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: theme[activeTheme].panelColor,
            color: theme[activeTheme].textColor,
            borderRadius: "4px",
            outline: "none",
            fontSize: "16px",
            textDecoration: "none",
            border: "none", // Removes the border
            boxShadow: "none", // Removes any default shadow
            outline: "none", // Removes the focus outline
            padding: "8px", // Optional: Add some padding for better appearance
          }}
        />
      </Col>
    </Row>
  );

  const withoutLabel = (
    <input
      id={inputId}
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px",
        backgroundColor: theme[activeTheme].panelColor,
        color: theme[activeTheme].textColor,
        borderRadius: "4px",
        outline: "none",
        fontSize: "16px",
        textDecoration: "none",
        border: border ? "1px solid" : "none", // Removes the border
        boxShadow: "none", // Removes any default shadow
        outline: "none", // Removes the focus outline
        padding: "8px", // Optional: Add some padding for better appearance
      }}
    />
  );

  return <>{label ? withLabel : withoutLabel}</>;
};

export default ThemedInput;
