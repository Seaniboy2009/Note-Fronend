import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDocs, query, where } from "firebase/firestore";
import { dbNotes } from "../../firebase";

const useNewDb = true; // ***********TODO remove this once new db is fully implemented**********

const NoteListPage = () => {
  const [myNotes, setMyNotes] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const userFirestore = useUser();

  useEffect(() => {
    const handleGetNotes = async () => {
      try {
        if (useNewDb) {
          const queryNotes = query(
            dbNotes,
            where("userId", "==", userFirestore.user.uid)
          );
          const querySnapshot = await getDocs(queryNotes);
          const userUpdatedResponse = querySnapshot.docs.map((doc) => ({
            docId: doc.id, // Firestore document ID
            ...doc.data(), // Document data
          }));
          setMyNotes({ results: userUpdatedResponse });
          console.log("Get my notes data:", userUpdatedResponse);
        }
      } catch (error) {
        const access = localStorage.getItem("access_token");
        if (error.response?.status === 401 && access) {
          window.location.reload();
        } else if (!access) {
          //navigate("/");
        } else {
          console.log("Other error");
        }
      }
      setHasLoaded(true);
    };

    const timer = setTimeout(() => {
      handleGetNotes();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userFirestore]);

  return (
    <Container fluid className={`text-center`}>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              <Link to={"/"}>
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
            </Col>
            <Col xs={10}>
              <h4>Notes</h4>
            </Col>
          </Row>
          <br />
          {userFirestore?.user ? (
            <Row>
              <Col xs={5}>
                <Link to={"note/create"}>
                  <button className={appStyle.ButtonCreate}>
                    <i className="fa-sharp fa-solid fa-plus" />
                  </button>
                </Link>
              </Col>
            </Row>
          ) : null}

          {myNotes?.results?.length !== 0 ? (
            <InfiniteScroll
              dataLength={myNotes.results.length}
              next={() => fetchMoreData(myNotes, setMyNotes)}
              hasMore={!!myNotes.next}
              loader={<Loader spinner text="Loading, please wait" />}
            >
              {myNotes?.results?.map((note, index) => (
                <>
                  <NoteItem key={note.id} {...note} />
                </>
              ))}
            </InfiniteScroll>
          ) : (
            <p>No notes yet</p>
          )}
        </>
      ) : (
        <Loader spinner text="Loading notes, please wait" />
      )}
    </Container>
  );
};

export default NoteListPage;
