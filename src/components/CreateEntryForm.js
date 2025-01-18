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
      setError("Cant create an empty note");
      return;
    }
    if (onCreate) {
      onCreate({ note, color }); // Pass data back to parent
      setNote(""); // Clear input fields
      setError(""); // Clear
      setColor("#ffffff"); // Reset color picker
    }
  };

  return (
    <Container style={{ marginBottom: "10px" }}>
      <Row>
        <Col xs={8} style={{ alignContent: "center", padding: "0" }}>
          <textarea
            disabled={!isEditable}
            placeholder="Create new entry"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              height: "50%",
              backgroundColor: theme[activeTheme].panelColor,
              color: theme[activeTheme].color,
              border: "0",
              width: "100%",
              marginTop: "5px",
            }}
          />
        </Col>
        <Col
          xs={2}
          style={{ alignContent: "center", padding: "0", paddingLeft: "5px" }}
        >
          {advancedFeatures ? (
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          ) : null}
        </Col>
        <Col
          xs={2}
          style={{ alignContent: "center", padding: "0", paddingLeft: "5px" }}
        >
          <ThemedButton fullWidth={false} onClick={handleCreate} size="small">
            Create
          </ThemedButton>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{error}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateEntryForm;
