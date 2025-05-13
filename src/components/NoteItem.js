import React from "react";
import { Link } from "react-router-dom";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";
import ThemedButton from "./ThemedButton";
import ThemedTextarea from "./ThemedTextArea";

const NoteItem = (props) => {
  const {
    docId,
    title,
    detailPage,
    date_created,
    handleNoteUpdate,
    hasEdited,
    handleSave,
    image_url,
  } = props;

  const { activeTheme, theme } = useTheme();
  const [noteUpdate, setNoteUpdate] = React.useState({});
  const handleChange = (updatedNote) => {
    setNoteUpdate(updatedNote);
    handleNoteUpdate(updatedNote);
  };

  const noteListPage = (
    <Link to={`note/${docId}`}>
      <Container
        style={{
          backgroundColor: theme[activeTheme].panelColor,
          color: theme[activeTheme].color,
          border: theme[activeTheme].border,
          marginBottom: "10px",
        }}
      >
        <Row>
          {" "}
          <Col xs={12}>{title}</Col>
        </Row>
        <Row style={{ padding: "0px", fontSize: "70%" }}>
          {" "}
          <Col xs={10}></Col>
          <Col xs={2}>
            {image_url ? (
              <i className="fa-solid fa-image"></i>
            ) : (
              <span style={{ paddingBottom: "20px" }}></span>
            )}
          </Col>
        </Row>
        <Row>
          {" "}
          <Col xs={12} style={{ fontSize: "70%" }}>
            {date_created}
          </Col>
        </Row>
      </Container>
    </Link>
  );

  return detailPage ? (
    <>
      <Container>
        {" "}
        <Row>
          <Col xs={2}>
            <Link to={"/notes/"}>
              <i className="fa-solid fa-arrow-left" />
              &nbsp;
            </Link>
          </Col>
          <Col xs={6}>
            <p>{<Col style={{ fontSize: "70%" }}>{date_created}</Col>}</p>
          </Col>
          {hasEdited && (
            <Col xs={4}>
              <ThemedButton onClick={handleSave} className="btn btn-primary">
                Save
              </ThemedButton>
            </Col>
          )}
        </Row>
        <Container
          style={{
            backgroundColor: theme[activeTheme].panelColor,
            border: theme[activeTheme].border,
          }}
          className={` text-left  ${appStyle.BackgroundContainer}`}
        >
          <Row style={{ fontWeight: 400, fontFamily: "Gill Sans" }}>
            <Col>
              <ThemedTextarea
                value={title}
                type={"text Box"}
                onChange={(e) => {
                  const updatedNote = { ...noteUpdate, title: e.target.value };
                  handleChange(updatedNote);
                }}
              ></ThemedTextarea>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  ) : (
    <>{noteListPage}</>
  );
};

export default NoteItem;
