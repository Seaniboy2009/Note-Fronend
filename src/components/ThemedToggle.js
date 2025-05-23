import React from "react";
import { useTheme } from "../contexts/ThemeSelection";
import { Col, Row } from "react-bootstrap"; // Add this line to import Col component

const ThemedToggle = ({ id, handleToggle, isChecked, text }) => {
  const { theme, activeTheme } = useTheme();
  const checkBoxId = `custom-checkbox-${id || Math.random()}`;

  const handleChecked = (event) => {
    if (handleToggle) {
      handleToggle(event);
    }
  };

  const withText = (
    <Row>
      {text ? (
        <Col>
          {" "}
          <p>{text}</p>
        </Col>
      ) : null}
      <Col xs={2}>
        <input
          id={checkBoxId}
          type="checkbox"
          checked={isChecked}
          onChange={handleChecked}
          style={{ display: "none" }}
        />
        <label
          htmlFor={checkBoxId}
          style={{
            cursor: "pointer",
            width: "20px",
            height: "20px",
            backgroundColor: isChecked
              ? theme[activeTheme].toggleColor
              : theme[activeTheme].backgroundColor,
            border: `2px solid ${theme[activeTheme].color}`,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isChecked ? "white" : theme[activeTheme].color,
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {isChecked ? "X" : ""}
        </label>
      </Col>
    </Row>
  );

  const withoutText = (
    <Col xs={1}>
      <input
        id={checkBoxId}
        type="checkbox"
        checked={isChecked}
        onChange={handleChecked}
        style={{ display: "none" }}
      />
      <label
        htmlFor={checkBoxId}
        style={{
          cursor: "pointer",
          width: "20px",
          height: "20px",
          backgroundColor: isChecked
            ? theme[activeTheme].toggleColor // Use toggleColor when toggled
            : theme[activeTheme].backgroundColor, // Use default background color
          border: `2px solid ${theme[activeTheme].color}`,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isChecked ? "white" : theme[activeTheme].color,
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {isChecked ? "x" : ""}
      </label>
    </Col>
  );

  return <>{text ? withText : withoutText}</>;
};

export default ThemedToggle;
