import React from "react";
import { Link } from "react-router-dom";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../contexts/ThemeSelection";
import ThemedButton from "./ThemedButton";
import ThemedTextarea from "./ThemedTextArea";
import { returnCategoryIcon } from "../utils/CategoryUtils";

const NoteItem = (props) => {
  const {
    docId,
    title,
    is_private: privateNote,
    category,
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
    <Container
      style={{
        backgroundColor: theme[activeTheme].panelColor,
        color: theme[activeTheme].color,
        border: theme[activeTheme].border,
        marginBottom: "10px",
      }}
    >
      {" "}
      <Link
        to={`note/${docId}`}
        style={{ textDecoration: "none", color: "inherit", hover: "none" }}
      >
        <Row style={{ paddingTop: "5px" }}>
          <Col xs={10}>{title}</Col>
          <Col xs={2} style={{ fontSize: "70%" }}>
            <Row style={{ padding: "0px" }}>
              <Col style={{ padding: "0px" }}>
                {privateNote ? <i className="fa-solid fa-lock" /> : null}
              </Col>

              <Col style={{ padding: "0px" }}>
                {image_url ? <i className="fa-solid fa-image" /> : null}
              </Col>
              <Col style={{ padding: "0px" }}>
                {returnCategoryIcon(category)}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs={10}></Col>
        </Row>
        <Row style={{ padding: "0px", fontSize: "70%" }}>
          <Col xs={10}> {date_created}</Col>
        </Row>
      </Link>
    </Container>
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
