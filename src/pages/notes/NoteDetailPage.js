import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const NoteDetailPage = () => {
  const { docId } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userData } = useUser();
  const [hasEdited, setHasEdited] = useState(false);

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

  return (
    <Container>
      {hasLoaded ? (
        <NoteItem
          key={docId}
          {...note}
          detailPage
          handleNoteUpdate={handleNoteUpdate}
          setHasEdited={setHasEdited}
          hasEdited={hasEdited}
          handleSave={handleSave}
        />
      ) : (
        <>
          <Loader spinner text="loading note" />
        </>
      )}
    </Container>
  );
};

export default NoteDetailPage;
