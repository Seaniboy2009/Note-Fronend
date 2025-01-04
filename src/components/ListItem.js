import React, { useState } from "react";
import style from "../styles/ListDetailPage.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";
import { Container } from "react-bootstrap";
import { deleteDoc, doc } from "firebase/firestore";
import { dbListItems } from "../firebase"; // Make sure you import your Firestore collection
import ThemedButton from "./ThemedButton";

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
      // Call the onDelete function passed from the parent
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
      <Row style={{ textAlign: "center" }}>
        <Col
          xs={10}
          style={listItem?.toggle ? { textDecoration: "line-through" } : null}
        >
          <p>
            <strong>{listItem?.content}</strong>
          </p>
        </Col>
        <Col
          xs={2}
          className={style.ListItem}
          style={{ textAlign: "right", paddingTop: "10px" }}
        >
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
              display: "inline-block",
              backgroundColor: isChecked
                ? "red"
                : theme[activeTheme].backgroundColor,
              border: `2px solid ${theme[activeTheme].textColor}`,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isChecked ? "white" : theme[activeTheme].textColor,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {isChecked ? "X" : ""}
          </label>
        </Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <Col xs={8}>
          <p>
            {listItem?.date_created
              ? `Created on: ${new Date(
                  listItem?.dateCreated
                ).toLocaleTimeString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : null}
          </p>
          <p>
            {listItem.completedDate
              ? `Completed on: ${new Date(
                  listItem?.completedDate
                ).toLocaleTimeString([], {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : null}
          </p>
        </Col>
        <Col xs={4} style={{ textAlign: "right", paddingTop: "10px" }}>
          {/* Delete button */}
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
    </Container>
  );
};

export default ListItem;
