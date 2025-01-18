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
      style={{
        alignContent: "center",
        marginBottom: "5px",
        alignItems: "center",
      }}
    >
      <Row style={{ alignContent: "center", padding: "0" }}>
        <Col xs={9} style={{ alignContent: "center", padding: "0" }}>
          <textarea
            disabled={!isEditable}
            value={entry.note}
            onChange={handleNoteChange}
            placeholder={entry.note ? "" : "No note added"}
            style={{
              height: "90%",
              backgroundColor: theme[activeTheme].panelColor,
              color: theme[activeTheme].color,
              border: "0",
              width: "100%",
            }}
          />
        </Col>
        <Col
          xs={2}
          style={{
            padding: "5px",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="color"
            value={entry.color || "#000000"}
            onChange={handleColorChange}
            style={{ height: "85%", width: "80%", padding: "0" }}
            disabled={!advancedFeatures}
          />
        </Col>

        <Col xs={1} style={{ alignContent: "center", padding: "0" }}>
          <ThemedButton
            fullWidth={false}
            size="small"
            onClick={() => handleUpdateClick(entry)}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </ThemedButton>{" "}
          <ThemedButton
            onClick={() => handleDeleteClick(entry)}
            fullWidth={false}
            size="small"
          >
            <i className="fa-regular fa-trash-can"></i>
          </ThemedButton>
        </Col>
      </Row>
    </Container>
  );
};

export default DayEntry;
