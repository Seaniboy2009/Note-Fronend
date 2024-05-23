import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import { Container } from "react-bootstrap";
import { axiosInstance } from "../../api/axiosDefaults";

import Loader from "../../components/Loader";

const NoteDetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const getNote = async () => {
      const { data } = await axiosInstance.get(`/api/notes/${id}`);
      setNote(data);
      setHasLoaded(true);
      console.log(data);
    };

    const timer = setTimeout(() => {
      getNote();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <Container className={appStyle.Container}>
      {hasLoaded ? (
        <NoteItem key={id} {...note} detailPage />
      ) : (
        <>
          <Loader spinner text="loading note" />
        </>
      )}
    </Container>
  );
};

export default NoteDetailPage;
