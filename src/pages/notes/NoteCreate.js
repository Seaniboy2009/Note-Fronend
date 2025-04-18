import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SearchPage from "../SearchPage";
import { useTheme } from "../../contexts/ThemeSelection";
import { useUser } from "../../contexts/UserContext";
import { addDoc } from "firebase/firestore";
import { dbNotes } from "../../firebase";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import ThemedToggle from "../../components/ThemedToggle";

const NoteCreate = () => {
  const navigate = useNavigate();
  const imageInput = useRef(null);
  const { userData } = useUser();

  const [noteData, setNoteData] = useState({
    title: "",
    category: "Other",
    image_url: "",
    is_private: false,
  });

  const { theme, activeTheme } = useTheme();
  const [submitting, setSubmitting] = useState(false);
  const [pickImage, setPickImage] = useState(true);
  const [pickedImageFromList, setPickedImageFromList] = useState(false);

  // Create a new note
  const createNote = async () => {
    if (!userData?.user) return;

    setSubmitting(true);
    try {
      const noteCreatedResponse = await addDoc(dbNotes, {
        ...noteData,
        date_created: new Date(),
        userId: userData.user.uid,
      });

      console.log("Note created: ", noteCreatedResponse);
      navigate(`/notes/`);
    } catch (error) {
      console.error("Error creating note:", error);
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

  // Handle toggling "is_private"
  const handleToggle = () => {
    setNoteData((prevData) => ({
      ...prevData,
      is_private: !prevData.is_private,
    }));
  };

  // Handle setting image from list
  const handlePickedImageFromList = (imageUrl) => {
    console.log("Image URL:", imageUrl);
    setPickedImageFromList(!!imageUrl);
    setNoteData((prevData) => ({
      ...prevData,
      image_url: imageUrl,
    }));
  };

  // Toggle image selection
  const togglePickImage = () => {
    setPickImage((prev) => !prev);
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
        {/* <Row style={{ alignItems: "center" }}>
          <Col xs={8}>
            <ThemedToggle
              isChecked={noteData.is_private}
              name="is_private"
              handleToggle={handleToggle}
              text="Make Private"
            />
          </Col>
        </Row> */}
        {/* <Row style={{ alignItems: "center" }}>
          <Col>
            <label htmlFor="image">Image</label>
          </Col>
          <Col>
            <input
              type="file"
              name="image"
              id="image"
              ref={imageInput}
              onChange={(e) =>
                setNoteData((prevData) => ({
                  ...prevData,
                  image: e.target.files[0],
                  image_url: "",
                }))
              }
            />
          </Col>
        </Row> */}
        {pickedImageFromList && (
          <>
            {" "}
            <Row style={{ padding: "10px 0", alignItems: "center" }}>
              <Col>
                <img
                  src={noteData.image_url}
                  style={{ width: "50%", height: "50%", marginLeft: "25%" }}
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

        <Row style={{ padding: "10px 0" }}>
          <Col>
            <ThemedButton onClick={createNote} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </ThemedButton>
          </Col>
        </Row>
      </Container>
      {pickImage && (
        <SearchPage
          searchText={noteData.title}
          searchPage
          category={noteData.category}
          handlePickedImageFromList={handlePickedImageFromList}
        />
      )}
    </Container>
  );
};

export default NoteCreate;
