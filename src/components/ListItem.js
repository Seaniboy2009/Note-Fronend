import React, { useState } from "react";
import style from "../styles/ListDetailPage.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";
import { Container } from "react-bootstrap";
import ThemedButton from "./ThemedButton";
import ThemedToggle from "./ThemedToggle";

const ListItem = ({ listItem, onToggle, onDelete }) => {
  const { activeTheme, theme } = useTheme();
  const [isChecked, setIsChecked] = useState(listItem.toggle);
  const checkBoxId = `custom-checkbox-${listItem.docId}`;

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
        backgroundColor: theme[activeTheme].pannelColor,
        border: theme[activeTheme].border,
        marginBottom: "10px",
      }}
    >
      <Row
        style={{
          textAlign: "left",
          lineHeight: "30px",
          display: "flex",
          alignItems: "center", // Ensures all elements are vertically aligned
        }}
      >
        {/* <Col xs={1} style={{ textAlign: "right" }}>
          <input
            id={checkBoxId}
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            style={{ display: "none" }}
          />
          <label
            htmlFor={checkBoxId}
            style={{
              cursor: "pointer",
              width: "20px",
              height: "20px",
              display: "flex", // Use flex to align the "X"
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isChecked
                ? theme[activeTheme].toggleColor // Use toggleColor when toggled
                : theme[activeTheme].backgroundColor, // Use default background color
              border: `2px solid ${theme[activeTheme].textColor}`,
              borderRadius: "4px",
              color: isChecked ? "white" : theme[activeTheme].textColor,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {isChecked ? "X" : ""}
          </label>
        </Col> */}
        <ThemedToggle isChecked={isChecked} handleToggle={handleToggle} />
        <Col
          xs={8}
          style={{
            textDecoration: listItem?.toggle ? "line-through" : "none",
            color: listItem?.toggle
              ? theme[activeTheme].textUnavailable // Use textUnavailable for ticked items
              : theme[activeTheme].color, // Use default color for unticked items
          }}
        >
          <Col>
            <p style={{ marginBottom: 0 }}>
              <strong>{listItem?.content}</strong>{" "}
            </p>
          </Col>
          <Col>
            <p>
              {" "}
              {listItem?.date_created
                ? `${new Date(listItem?.dateCreated).toLocaleTimeString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : null}
              {""}
              {/* {listItem.completedDate
                ? `Completed on: ${new Date(
                    listItem?.completedDate
                  ).toLocaleTimeString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : null} */}
            </p>
          </Col>
        </Col>
        <Col xs={3} style={{ textAlign: "right" }}>
          <ThemedButton
            onClick={handleDelete}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: "red",
            }}
          >
            Delete
          </ThemedButton>
        </Col>
      </Row>

      {/* Media query styling */}
    </Container>
  );
};

export default ListItem;
