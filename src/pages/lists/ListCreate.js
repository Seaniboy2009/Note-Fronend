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

const ListCreate = () => {
  const navigate = useNavigate();
  const userFirestore = useUser();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    is_private: false,
  });
  const { theme, activeTheme } = useTheme();
  const { title, is_private } = formData;
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
        is_private: is_private,
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
    setFormData({ ...formData, is_private: event.target.checked });
  };

  // Handle title change
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
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
      <Row>
        <Col md={1}>
          <Link to={"/lists/"} className={appStyle.ButtonLink}>
            Back
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          {" "}
          <h4>Title</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            style={{
              backgroundColor: theme[activeTheme].backgroundColor,
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
            }}
          />
          {error ? <span style={{ color: "red" }}>{error}</span> : null}
        </Col>
      </Row>
      <br />

      <ThemedToggle
        isChecked={formData.is_private}
        handleToggle={handleToggle}
        text="Toggle Private"
      />

      <Row>
        <Col md={1}>
          <ThemedButton onClick={createList}>Create</ThemedButton>
        </Col>
      </Row>
    </Container>
  );

  return (
    <Container fluid className={appStyle.Container}>
      {submit ? submittingText : defaultText}
    </Container>
  );
};

export default ListCreate;
