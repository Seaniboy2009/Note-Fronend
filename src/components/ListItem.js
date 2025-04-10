import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";
import { Container } from "react-bootstrap";
import ThemedButton from "./ThemedButton";
import ThemedToggle from "./ThemedToggle";

const ListItem = ({ listItem, onToggle, onDelete }) => {
  const { activeTheme, theme } = useTheme();
  const [isChecked, setIsChecked] = useState(listItem.toggle);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);

    if (onToggle) {
      onToggle(listItem);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete(listItem);
      }
    } catch (error) {
      console.error("Error deleting list item:", error);
    }
  };

  return (
    <Container
      style={{
        backgroundColor: theme[activeTheme].panelColor,
        border: theme[activeTheme].border,
        marginBottom: "10px",
      }}
    >
      <Row
        style={{
          display: "flex",
          alignItems: "center", // Ensures vertical alignment
          justifyContent: "space-between", // Spreads the items across the row
          textAlign: "left",
          lineHeight: "1.5", // Consistent spacing
        }}
      >
        {/* Toggle Switch */}
        <ThemedToggle isChecked={isChecked} handleToggle={handleToggle} />

        {/* Content Column */}
        <Col
          xs={7}
          style={{
            padding: "0",
            margin: "0",
            display: "flex",
            flexDirection: "column", // Aligns content and date vertically
          }}
        >
          {/* Main Content */}
          <p
            style={{
              margin: "0",
              textDecoration: listItem?.toggle ? "line-through" : "none",
              color: listItem?.toggle
                ? theme[activeTheme].textUnavailable
                : theme[activeTheme].color,
            }}
          >
            <strong>{listItem?.content}</strong>
          </p>

          {/* Date Created */}
          {listItem?.date_created && (
            <p
              style={{
                margin: "0",
                fontSize: "0.85em",
                color: "#888", // Lighter color for date
              }}
            >
              {new Date(listItem?.date_created).toLocaleTimeString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </Col>

        {/* Delete Button */}
        <ThemedButton
          onClick={handleDelete}
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "red",
            padding: "0",
            paddingRight: "10px",
            margin: "0",
            textAlign: "right",
          }}
        >
          Delete
        </ThemedButton>
      </Row>
    </Container>
  );
};

export default ListItem;
