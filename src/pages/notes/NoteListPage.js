import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import NoteItem from "../../components/NoteItem";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosInstance } from "../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData, fetchMoreDataURL } from "../../utils/utils";
import AuthContext from "../../contexts/AuthContext";
import Loader from "../../components/Loader";
import { useTheme } from "../../contexts/ThemeSelection";
import { Button } from "bootstrap";

const NoteListPage = () => {
  const [myNotes, setMyNotes] = useState({ results: [] });
  const [notes, setNotes] = useState({ results: [] });
  const [viewSelection, setViewSelection] = useState("Movie"); // set to movies to show all movies on page load
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  let { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [gridLayout, setGridLayout] = useState(false);

  useEffect(() => {
    const getMyNotes = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/notes/?owner=${user.user_id}`
        );
        setMyNotes(data);
        setHasLoaded(true);
        console.log("Get my notes data:", data);
      } catch (error) {
        const access = localStorage.getItem("access_token");
        if (error.response?.status === 401 && access) {
          window.location.reload();
        } else if (!access) {
          navigate("/");
        } else {
          console.log("Other error");
        }
        setErrors(error);
      }
    };

    const timer = setTimeout(() => {
      getMyNotes();
      // getNotes()
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [user, navigate, viewSelection]);

  const handleChangeLayout = () => {
    setGridLayout(!gridLayout);
    console.log(gridLayout);
  };

  const handleChangeSelection = (event) => {
    if (event.target.name === "Other") {
      console.log("Other");
      setViewSelection("Other");
    } else if (event.target.name === "Movie") {
      console.log("Movie");
      setViewSelection("Movie");
    } else if (event.target.name === "Game") {
      console.log("Game");
      setViewSelection("Game");
    } else if (event.target.name === "All") {
      console.log("All");
      setViewSelection("All");
    }
  };

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
            <Col xs={6}>
              <h4>Your Notes</h4>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={5}>
              <Link to={"note/create"}>
                <button className={appStyle.ButtonCreate}>
                  <i className="fa-sharp fa-solid fa-plus" />
                </button>
              </Link>
            </Col>
          </Row>
          <InfiniteScroll
            dataLength={myNotes.results.length}
            next={() => fetchMoreData(myNotes, setMyNotes)}
            hasMore={!!myNotes.next}
            loader={<Loader spinner text="Loading, please wait" />}
          >
            {myNotes?.results?.map((note, index) => (
              <>
                {/* 
                    this code is taking the view selection and if its all it will show all the notes
                    or if the view selection is the same as the current note category then show the note
                  */}
                {/* {viewSelection === 'All' || viewSelection === note.category ? (<NoteItem key={index} {...note} grid={gridLayout}/>) : null} */}
                <NoteItem key={index} {...note} grid={gridLayout} />
              </>
            ))}
          </InfiniteScroll>
          <Row>
            <h5>All notes</h5>
          </Row>
          {notes?.results?.map((note, index) => (
            <Row key={index}>
              {note.is_private ? null : <NoteItem key={index} {...note} />}
            </Row>
          ))}
        </>
      ) : (
        <Loader spinner text="Loading notes, please wait" />
      )}
    </Container>
  );
};

export default NoteListPage;
