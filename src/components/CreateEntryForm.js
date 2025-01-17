import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ThemedButton from "./ThemedButton";

const CreateEntryForm = ({
  isEditable,
  theme,
  activeTheme,
  advancedFeatures,
  onCreate,
}) => {
  const [note, setNote] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!note) {
      setError("Please enter a note");
      return;
    }
    if (onCreate) {
      onCreate({ note, color }); // Pass data back to parent
      setNote(""); // Clear input fields
      setColor("#ffffff"); // Reset color picker
    }
  };

  return (
    <Container style={{ marginBottom: "10px", border: "1px solid" }}>
      <Row>
        <Col xs={12}>
          <textarea
            disabled={!isEditable}
            placeholder="Create new entry"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              height: "auto",
              backgroundColor: theme[activeTheme].panelColor,
              color: theme[activeTheme].color,
              border: "0",
              padding: "8px",
              width: "100%",
              marginTop: "10px",
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>{error}</Col>
      </Row>
      <Row>
        <Col xs={2} style={{ padding: "10px" }}>
          <p>Color: </p>
        </Col>
        <Col xs={2} style={{ padding: "5px" }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={!advancedFeatures}
          />
        </Col>
        <Col xs={8} style={{ textAlign: "right", padding: "10px" }}>
          <ThemedButton fullWidth={false} onClick={handleCreate}>
            Create
          </ThemedButton>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateEntryForm;
