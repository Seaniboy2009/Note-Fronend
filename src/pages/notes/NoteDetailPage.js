import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const NoteDetailPage = () => {
  const { docId } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userData } = useUser();

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

  return (
    <Container className={appStyle.Container}>
      {hasLoaded ? (
        <NoteItem key={docId} {...note} detailPage />
      ) : (
        <>
          <Loader spinner text="loading note" />
        </>
      )}
    </Container>
  );
};

export default NoteDetailPage;
