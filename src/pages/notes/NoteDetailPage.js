import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextarea from "../../components/ThemedTextArea";
import axios from "axios";
import ThemedInput from "../../components/ThemedInput";
import ImageShowModal from "../../components/ImageShowModal";
import ConfirmationModal from "../../components/ConfirmModal";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const NoteDetailPage = () => {
  const { docId } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userDetails } = useUser();
  const [hasEdited, setHasEdited] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const { activeTheme, theme } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPrivateNote, setShowPrivateNote] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const isSubscriber = userDetails?.subscription.active === true;
  const isSubscriptionModeEnabled =
    process.env.REACT_APP_SUBSCRIPTION_ACTIVE === "true";
  const navigate = useNavigate();

  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  useEffect(() => {
    if (!userDetails) return;

    const handleGetNote = async () => {
      const docRef = doc(db, "notes", docId);
      const docSnap = await getDoc(docRef);
      if (userDetails?.user.uid !== docSnap.data().userId) {
        return;
      }
      if (docSnap.exists()) {
        const noteData = docSnap.data();
        if (noteData.date_created.seconds) {
          // If it's a Firestore Timestamp
          noteData.date_created = new Date(
            noteData.date_created.seconds * 1000
          ).toLocaleDateString();
        } else if (typeof noteData.date_created === "string") {
          // If it's already a string date
          noteData.date_created = new Date(
            noteData.date_created
          ).toLocaleDateString();
        } else {
          console.error("Invalid date format for noteData.date_created");
        }
        setNote(noteData);
        if (noteData.is_private) {
          setShowPrivateNote(false);
          setIsPrivate(noteData.is_private);
          setShowImage(false);
        } else {
          setShowPrivateNote(true);
        }
        console.log("note", noteData);
        setHasLoaded(true);
      } else {
        console.error("No such document!");
      }
    };

    const timer = setTimeout(() => {
      handleGetNote();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [docId, userDetails]);

  const handleNoteUpdate = (updatedNote) => {
    setHasEdited(true);
    setNote((prevNote) => ({
      ...prevNote,
      ...updatedNote,
    }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "notes", docId);

      const { date_created, ...noteToSave } = note;

      await updateDoc(docRef, noteToSave);
      setHasEdited(false);
      console.log("Note updated successfully");
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async () => {
    try {
      const docRef = doc(db, "notes", docId);
      await deleteDoc(docRef);
      navigate(`/notes/`);
    } catch (error) {
      console.log("Error deleting note", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }

    setShowImage(false);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "notes_unsigned"); // 🔁 Replace with your preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, // 🔁 Replace cloud name
        formData
      );
      handleNoteUpdate({ image_url: response.data.secure_url });
      console.log("Image uploaded successfully:", response.data.secure_url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      {hasLoaded ? (
        <Container>
          <Row
            style={{
              marginBottom: "10px",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            <Col xs={2}>
              <ThemedButton
                onClick={() => navigate("/notes/")}
                fullWidth={false}
              >
                <i className="fa-solid fa-arrow-left" />
              </ThemedButton>
            </Col>
            <Col xs={8}>
              <p>{note.date_created}</p>
            </Col>
            {isPrivate ? (
              <Col xs={2}>
                <ThemedButton
                  onClick={() => setShowPrivateNote(!showPrivateNote)}
                  fullWidth={false}
                >
                  {showPrivateNote ? (
                    <i className="fa-solid fa-eye" />
                  ) : (
                    <i className="fa-solid fa-eye-slash" />
                  )}
                </ThemedButton>
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col xs={4}>
              {" "}
              {hasEdited && (
                <ThemedButton onClick={handleSave} className="btn btn-primary">
                  Save
                </ThemedButton>
              )}
            </Col>
            <Col xs={4} style={{ padding: "0 2px" }}>
              {" "}
              {note.image_url && showPrivateNote ? (
                <ThemedButton
                  onClick={() => setShowImage(!showImage)}
                  className="btn btn-primary"
                >
                  {showImage ? "Hide image" : "Show image"}{" "}
                </ThemedButton>
              ) : null}
            </Col>

            <Col xs={4}>
              <ThemedButton
                onClick={() => setShowConfirmationModal(true)}
                className="btn btn-primary"
              >
                Delete
              </ThemedButton>
            </Col>
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
                <ThemedInput
                  value={note.title}
                  type={"text"}
                  onChange={(e) => {
                    const updatedNote = {
                      title: e.target.value,
                    };
                    handleNoteUpdate(updatedNote); // Update state and notify parent
                  }}
                ></ThemedInput>
              </Col>
            </Row>
          </Container>
          {!showPrivateNote ? (
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
              }}
              className={` text-left  ${appStyle.BackgroundContainer}`}
            >
              <Row
                style={{
                  fontWeight: 400,
                  fontFamily: "Gill Sans",
                  textAlign: "center",
                }}
              >
                <Col>
                  <i
                    className="fa-solid fa-lock"
                    style={{ fontSize: "24px" }}
                  />
                </Col>
              </Row>
            </Container>
          ) : (
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
                    value={note.details || ""}
                    type={"text Box"}
                    onChange={(e) => {
                      const updatedNote = {
                        // ...noteUpdate,
                        details: e.target.value,
                      };
                      handleNoteUpdate(updatedNote); // Update state and notify parent
                    }}
                  ></ThemedTextarea>
                </Col>
              </Row>
            </Container>
          )}
          {isSubscriber || !isSubscriptionModeEnabled ? (
            <Container>
              <Row style={{ padding: "10px 0" }}>
                <Col xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center", // horizontal center
                      alignItems: "center", // vertical center (if you give it height)
                    }}
                  >
                    <ThemedInput
                      type="file"
                      value={note.image_url ? "Change image" : "Upload image"}
                      border={true}
                      onChange={handleFileChange}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
          ) : null}
          {uploading && <p>Uploading...</p>}

          {showImage && note.image_url ? (
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
              }}
              className={` text-left  ${appStyle.BackgroundContainer}`}
            >
              <Row
                style={{
                  padding: "10px 0",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Col onClick={() => handleImageClick(note?.image_url)}>
                  <img
                    src={note?.image_url}
                    style={{ width: "50%", height: "50%", marginLeft: "25%" }}
                    alt="Selected"
                  />
                </Col>
              </Row>
            </Container>
          ) : null}
        </Container>
      ) : (
        <>
          <Loader spinner text="loading note" />
        </>
      )}
      <ImageShowModal
        show={showModal}
        imageSrc={modalImage}
        onClose={handleCloseModal}
      />
      {showConfirmationModal && (
        <ConfirmationModal
          show={showConfirmationModal}
          onConfirm={handleDeleteNote}
          message={
            "Are you sure you want to delete this note? This action cannot be undone."
          }
          onClose={() => setShowConfirmationModal(false)}
        />
      )}
    </Container>
  );
};

export default NoteDetailPage;
