import React from "react";
import { useTheme } from "../contexts/ThemeSelection";
import { Col, Row } from "react-bootstrap";

const ThemedTextarea = ({
  id,
  placeholder = "Type here...",
  value,
  onChange,
  border,
  label,
  rows = 6,
}) => {
  const { theme, activeTheme } = useTheme();
  const inputId = id || `themed-textarea-${Math.random()}`;

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  const textareaStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: theme[activeTheme].panelColor,
    color: theme[activeTheme].color,
    borderRadius: "4px",
    outline: "none",
    fontSize: "16px",
    border: border ? `1px solid ${theme[activeTheme].color}` : "none",
    resize: "vertical",
    boxShadow: "none",
  };

  return (
    <Row>
      {label && (
        <Col>
          <label
            htmlFor={inputId}
            style={{
              display: "block",
              marginBottom: "5px",
              color: theme[activeTheme].color,
              fontWeight: "bold",
            }}
          >
            {label}
          </label>
        </Col>
      )}
      <Col>
        <textarea
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={textareaStyle}
          rows={rows}
        />
      </Col>
    </Row>
  );
};

export default ThemedTextarea;
