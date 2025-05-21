import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchPage from "../SearchPage";
import { useTheme } from "../../contexts/ThemeSelection";
import { useUser } from "../../contexts/UserContext";
import { addDoc, query, where, getCountFromServer } from "firebase/firestore";
import { dbNotes } from "../../firebase";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";

const NoteCreate = () => {
  const navigate = useNavigate();
  const { userDetails } = useUser();
  const [pickedImageFromList, setPickedImageFromList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { theme, activeTheme } = useTheme();
  const [noteData, setNoteData] = useState({
    title: "",
    category: "Other",
    image_url: "",
    is_private: false,
  });
  const [error, setError] = useState(null);
  const isSubscriber = userDetails?.subscription.active === true;
  const pickImage = isSubscriber;

  // Create a new note
  const createNote = async () => {
    if (!userDetails?.user) return;

    if (!noteData.title) {
      setError("Please enter a title for the note.");
      return;
    }

    try {
      if (!isSubscriber) {
        const userNotesQuery = query(
          dbNotes,
          where("userId", "==", userDetails.user.uid)
        );
        const snapshot = await getCountFromServer(userNotesQuery);
        const noteCount = snapshot.data().count;

        if (noteCount >= 10) {
          setError("You need to be a subscriber to create more than 10 notes.");
          return;
        }
      }

      setSubmitting(true);
      const noteCreatedResponse = await addDoc(dbNotes, {
        ...noteData,
        date_created: new Date(),
        userId: userDetails.user.uid,
      });

      navigate(`/notes/note/${noteCreatedResponse.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
      setError("An error occurred while creating the note. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle changes for all inputs
  const handleChange = (name, value) => {
    setNoteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePickedImageFromList = (imageUrl) => {
    console.log("Image URL:", imageUrl);
    setPickedImageFromList(!!imageUrl);
    setNoteData((prevData) => ({
      ...prevData,
      image_url: imageUrl,
    }));
  };

  return (
    <Container fluid className={appStyle.Container}>
      <Row>
        <Col xs={10}>
          <Link to={"/notes/"}>
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </Col>
      </Row>
      <Container
        style={{
          backgroundColor: theme[activeTheme].panelColor,
          border: theme[activeTheme].border,
          marginBottom: "10px",
          textAlign: "left",
        }}
        className={appStyle.BackgroundContainer}
      >
        <Row style={{ alignItems: "center", textAlign: "center" }}>
          <Col>
            <h5>Create a New Note</h5>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <label style={{ padding: "10px" }} htmlFor="title">
              Title
            </label>
          </Col>
          <Col xs={6}>
            <ThemedInput
              value={noteData.title}
              name="title"
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </Col>
        </Row>
        <Row style={{ alignItems: "center" }}>
          <Col xs={6}>
            <label style={{ padding: "10px" }} htmlFor="category">
              Category
            </label>
          </Col>
          <Col xs={6}>
            <ThemedInput
              type="select"
              value={noteData.category}
              name="category"
              onChange={(e) => handleChange("category", e.target.value)}
              options={[
                { value: "Other", label: "Other" },
                { value: "Game", label: "Game" },
                { value: "Movie", label: "Movie" },
              ]}
            />
          </Col>
        </Row>
        {pickedImageFromList && (
          <>
            {" "}
            <Row style={{ padding: "10px 0", alignItems: "center" }}>
              <Col>
                <img
                  src={noteData.image_url}
                  style={{ width: "50%", height: "50%", marginLeft: "25%" }}
                  alt="Selected"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <ThemedButton onClick={() => handlePickedImageFromList(null)}>
                  Remove Selected Image
                </ThemedButton>
              </Col>
            </Row>
          </>
        )}

        <Row
          style={{
            padding: "10px 0",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Col>
            <ThemedButton onClick={createNote} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </ThemedButton>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Col>
        </Row>
      </Container>
      {pickImage ? (
        <SearchPage
          searchText={noteData.title}
          category={noteData.category}
          handlePickedImageFromList={handlePickedImageFromList}
        />
      ) : (
        <Row style={{ alignItems: "center", textAlign: "center" }}>
          <Col>
            <p>
              Image selection is disabled for your account, to enable it please
              upgrade your account.
            </p>
            <p>
              <Link to={"/account"}>
                <ThemedButton fullWidth={false}>Upgrade Account</ThemedButton>
              </Link>
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default NoteCreate;
