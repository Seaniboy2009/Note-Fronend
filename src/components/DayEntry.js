import React from "react";
import { Row, Col, Container } from "react-bootstrap"; // Ensure you're using React-Bootstrap if that's what this is based on
import ThemedButton from "./ThemedButton"; // Adjust the import path for your button component

const DayEntry = ({
  entry,
  isEditable,
  theme,
  activeTheme,
  advancedFeatures,
  handleUpdateClick,
  handleDeleteClick,
  setDayEntry,
}) => {
  const handleNoteChange = (e) => {
    const { value } = e.target;
    setDayEntry((prev) =>
      prev.map((item) =>
        item.id === entry.id ? { ...item, note: value } : item
      )
    );
  };

  const handleColorChange = (e) => {
    const { value } = e.target;
    setDayEntry((prev) =>
      prev.map((item) =>
        item.id === entry.id ? { ...item, color: value } : item
      )
    );
  };

  return (
    <Container
      key={entry.id}
      style={{ marginBottom: "10px", border: "1px solid" }}
    >
      <Row>
        <Col xs={12} style={{ padding: "10px" }}>
          <textarea
            disabled={!isEditable}
            value={entry.note}
            onChange={handleNoteChange}
            placeholder={entry.note ? "" : "No note added"}
            style={{
              height: "auto",
              backgroundColor: theme[activeTheme].panelColor,
              color: theme[activeTheme].color,
              border: "0",
              width: "100%",
              marginTop: "5px",
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2} style={{ textAlign: "center", padding: "5px" }}>
          <p style={{ margin: "0" }}>
            {new Date(entry.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </Col>

        <Col xs={1} style={{ padding: "5px" }}>
          <p>Color: </p>
        </Col>
        <Col xs={2} style={{ padding: "5px" }}>
          <input
            type="color"
            value={entry.color || "#000000"}
            onChange={handleColorChange}
            style={{ marginLeft: "5px" }}
            disabled={!advancedFeatures}
          />
        </Col>

        <Col xs={7} style={{ textAlign: "right", padding: "5px" }}>
          <ThemedButton
            fullWidth={false}
            size="small"
            onClick={() => handleUpdateClick(entry)}
          >
            Update
          </ThemedButton>{" "}
          <ThemedButton
            onClick={() => handleDeleteClick(entry)}
            fullWidth={false}
            size="small"
          >
            Delete
          </ThemedButton>
        </Col>
      </Row>
    </Container>
  );
};

export default DayEntry;
