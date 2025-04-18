import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
// import style from "../styles/NoteItem.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTheme } from "../../contexts/ThemeSelection";
import ThemedInput from "../../components/ThemedInput";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextarea from "../../components/ThemedTextArea";

const NoteDetailPage = () => {
  const { docId } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userData } = useUser();
  const [hasEdited, setHasEdited] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const { activeTheme, theme } = useTheme();
  const [noteUpdate, setNoteUpdate] = React.useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    const handleGetNote = async () => {
      const docRef = doc(db, "notes", docId);
      const docSnap = await getDoc(docRef);
      if (userData?.user.uid !== docSnap.data().userId) {
        return;
      }
      if (docSnap.exists()) {
        const noteData = docSnap.data();
        console.log("noteData", noteData);
        noteData.date_created = new Date(
          noteData.date_created.seconds * 1000
        ).toLocaleDateString();
        setNote(noteData);
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
  }, [docId, userData]);

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
      await updateDoc(docRef, note);
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

  return (
    <Container>
      {hasLoaded ? (
        <Container>
          {console.log("note", note)}{" "}
          <Row>
            <Col xs={1}>
              <Link to={"/notes/"}>
                <i className="fa-solid fa-arrow-left" />
                &nbsp;
              </Link>
            </Col>
            <Col xs={2}>
              <p>{note.date_created}</p>
            </Col>
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
              {note.image_url ? (
                <ThemedButton
                  onClick={() => setShowImage(!showImage)}
                  className="btn btn-primary"
                >
                  {showImage ? "Hide image" : "Show image"}
                </ThemedButton>
              ) : null}
            </Col>

            <Col xs={4}>
              <ThemedButton
                onClick={handleDeleteNote}
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
                <ThemedTextarea
                  value={note.title}
                  type={"text Box"}
                  onChange={(e) => {
                    const updatedNote = {
                      ...noteUpdate,
                      title: e.target.value,
                    };
                    handleNoteUpdate(updatedNote); // Update state and notify parent
                  }}
                ></ThemedTextarea>
              </Col>
            </Row>
          </Container>
          {showImage && (
            <Container
              style={{
                backgroundColor: theme[activeTheme].panelColor,
                border: theme[activeTheme].border,
              }}
              className={` text-left  ${appStyle.BackgroundContainer}`}
            >
              <Row style={{ padding: "10px 0", alignItems: "center" }}>
                <Col>
                  <img
                    src={note?.image_url}
                    style={{ width: "50%", height: "50%", marginLeft: "25%" }}
                  />
                </Col>
              </Row>
            </Container>
          )}
        </Container>
      ) : (
        <>
          <Loader spinner text="loading note" />
        </>
      )}
    </Container>
  );
};

export default NoteDetailPage;
