import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import { axiosInstance } from "../../api/axiosDefaults";

import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDoc, doc } from "firebase/firestore";
import { dbNotes, db } from "../../firebase";

const useNewDb = true; // ***********TODO remove this once new db is fully implemented**********

const NoteDetailPage = () => {
  const { docId } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const userFirestore = useUser();

  useEffect(() => {
    console.log(docId);
    const handleGetNote = async () => {
      if (useNewDb) {
        // const queryNotes = query(
        //   dbNotes,
        //   where("userId", "==", userFirestore.user.uid)
        // );
        //const querySnapshot = await getDocs(queryNotes);
        const docRef = doc(db, "notes", docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const noteData = docSnap.data();
          console.log("Document data:", noteData);

          setNote(noteData);
          setHasLoaded(true);
        } else {
          console.log("No such document!");
        }
      } else {
        const { data } = await axiosInstance.get(`/api/notes/${docId}`);
        setNote(data);
        setHasLoaded(true);
        console.log(data);
      }
    };

    const timer = setTimeout(() => {
      handleGetNote();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [docId]);

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
