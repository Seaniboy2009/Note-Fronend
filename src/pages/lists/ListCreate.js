import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import { useUser } from "../../contexts/UserContext";
import { addDoc } from "firebase/firestore";
import { dbLists } from "../../firebase";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ThemedButton from "../../components/ThemedButton";
import ThemedToggle from "../../components/ThemedToggle";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedInput from "../../components/ThemedInput";

const ListCreate = () => {
  const navigate = useNavigate();
  const userFirestore = useUser();
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const { theme, activeTheme } = useTheme();
  const [submit, setSubmit] = useState(false);

  // Send the title and private status to the API and create the new list
  const createList = async () => {
    if (!userFirestore || !userFirestore.user) return;
    if (!title) {
      setError("Title is required");
      return;
    }

    try {
      setSubmit(true);
      await addDoc(dbLists, {
        title: title,
        is_private: isPrivate,
        date_created: new Date().toISOString(),
        userId: userFirestore.user.uid,
      });
      setSubmit(false);
      navigate("/lists/");
    } catch (error) {
      console.log("Error creating list:", error);
    }
  };

  // Handle toggle change
  const handleToggle = (event) => {
    setIsPrivate(event.target.checked);
  };

  // Handle title change
  const handleChange = (event) => {
    console.log("event.target.value:", event.target.value);
    setTitle(event.target.value);
  };

  // Text for when the form is submitted
  const submittingText = (
    <Container>
      <Row>
        <Col>
          <h4>Please wait..Submitting</h4>
        </Col>
      </Row>
    </Container>
  );

  // Text for the user to input their list details
  const defaultText = (
    <Container
      style={{
        backgroundColor: theme[activeTheme].panelColor,
        border: theme[activeTheme].border,
        marginBottom: "10px",
      }}
    >
      <Row style={{ paddingTop: "10px" }}>
        <Col>
          <h5>Name your list</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <ThemedInput
            value={title}
            name="title"
            onChange={handleChange}
            border={true}
          />
          {error ? <span style={{ color: "red" }}>{error}</span> : null}
        </Col>
      </Row>
      <br />

      <ThemedToggle
        isChecked={isPrivate}
        handleToggle={handleToggle}
        text="Make Private"
      />

      <Row>
        <Col>
          <ThemedButton onClick={createList}>Create</ThemedButton>
        </Col>
      </Row>
      <br />
    </Container>
  );

  return (
    <Container fluid className={appStyle.Container}>
      <Row>
        <Col md={1}>
          <Link to={"/lists/"} className={appStyle.ButtonLink}>
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </Col>
      </Row>
      {submit ? submittingText : defaultText}
    </Container>
  );
};

export default ListCreate;
