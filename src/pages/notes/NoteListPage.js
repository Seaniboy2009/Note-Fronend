import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Loader from "../../components/Loader";
import { useUser } from "../../contexts/UserContext";
import { getDocs, query, where } from "firebase/firestore";
import { dbNotes } from "../../firebase";
import ThemedCreateButton from "../../components/ThemedCreateButton";
import { useTheme } from "../../contexts/ThemeSelection";

const NoteListPage = () => {
  const [myNotes, setMyNotes] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userData } = useUser();
  const { activeTheme, theme } = useTheme();

  useEffect(() => {
    const handleGetNotes = async () => {
      try {
        const queryNotes = query(
          dbNotes,
          where("userId", "==", userData.user.uid)
        );
        const querySnapshot = await getDocs(queryNotes);
        const userUpdatedResponse = querySnapshot.docs.map((doc) => ({
          docId: doc.id, // Firestore document ID
          ...doc.data(), // Document data
        }));
        const sortedNotes = userUpdatedResponse.sort(
          (a, b) => b.date_created.seconds - a.date_created.seconds
        );
        setMyNotes({ results: sortedNotes });
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
      setHasLoaded(true);
    };

    const timer = setTimeout(() => {
      handleGetNotes();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userData]);

  return (
    <Container
      fluid
      className={`text-center`}
      style={{ color: theme[activeTheme].color }}
    >
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              {/* <Link to={"/"}>
                <i className="fa-solid fa-arrow-left"></i>
              </Link> */}
            </Col>
            <Col xs={10}>
              <h5>Notes</h5>
            </Col>
          </Row>
          <br />
          {userData?.user ? (
            <Row>
              <Col xs={5}>
                <ThemedCreateButton url={"note/create"} />
              </Col>
            </Row>
          ) : null}

          {myNotes?.results?.length !== 0 ? (
            <InfiniteScroll
              dataLength={myNotes.results.length}
              next={() => fetchMoreData(myNotes, setMyNotes)}
              hasMore={!!myNotes.next}
              loader={<Loader spinner text="Loading, please wait" />}
              style={{
                overflowY: "hidden",
                overflowX: "hidden",
                paddingBottom: "50px",
              }}
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
