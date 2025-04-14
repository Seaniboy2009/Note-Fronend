import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../styles/ListPage.module.css";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUser } from "../../contexts/UserContext";
import { getDocs, query, where } from "firebase/firestore";
import { dbLists } from "../../firebase";
import Loader from "../../components/Loader";
import { useTheme } from "../../contexts/ThemeSelection";
import { fetchMoreData } from "../../utils/utils";
import ThemedCreateButton from "../../components/ThemedCreateButton";

const ListPage = () => {
  const [myLists, setMyLists] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { userData } = useUser();
  const { activeTheme, theme } = useTheme();

  useEffect(() => {
    const handleGetLists = async () => {
      try {
        const queryLists = query(
          dbLists,
          where("userId", "==", userData.user.uid)
        );
        const querySnapshot = await getDocs(queryLists);

        const userUpdatedResponse = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          let dateCreated = null;
          if (data.date_created) {
            if (
              typeof data.date_created === "object" &&
              "seconds" in data.date_created
            ) {
              dateCreated = new Date(
                data.date_created.seconds * 1000
              ).toISOString();
            } else {
              dateCreated = data.date_created;
            }
          }

          return {
            docId: doc.id, // Firestore document ID
            ...data, // Spread the document data
            dateCreated: dateCreated, // Overwrite `date_created` with normalized value
          };
        });

        const sortedResponse = userUpdatedResponse.sort((a, b) => {
          const dateA = new Date(a.dateCreated);
          const dateB = new Date(b.dateCreated);
          return dateB - dateA; // Descending order
        });

        setMyLists({ results: sortedResponse });
      } catch (error) {
        console.log("error", error);
      }
      setHasLoaded(true);
    };

    const timer = setTimeout(() => {
      handleGetLists();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userData]);

  return (
    <Container
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
              <h5>Lists</h5>
            </Col>
          </Row>
          <br />
          {userData?.user ? (
            <Row>
              <Col xs={5}>
                <ThemedCreateButton url={"list/create"} />
              </Col>
            </Row>
          ) : null}
          {myLists?.results?.length !== 0 ? (
            <InfiniteScroll
              dataLength={myLists.results.length}
              next={() => fetchMoreData(myLists, setMyLists)}
              hasMore={!!myLists.next}
              loader={<Loader spinner text="Loading, please wait" />}
            >
              {myLists?.results?.map((list, index) => (
                <Link key={list.id} to={`list/${list.docId}`}>
                  <Container
                    style={{
                      backgroundColor: theme[activeTheme].panelColor,
                      color: theme[activeTheme].color,
                      border: theme[activeTheme].border,
                      marginBottom: "10px",
                    }}
                  >
                    {" "}
                    <Row
                      style={{
                        textAlign: "left",
                        display: "flex",
                      }}
                    >
                      <Col>
                        <p>{list.title}</p>
                      </Col>
                      <Col>
                        <p>
                          {list.date_created
                            ? new Date(list.dateCreated).toLocaleTimeString(
                                [],
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : null}
                        </p>
                      </Col>
                    </Row>
                  </Container>
                </Link>
              ))}
            </InfiniteScroll>
          ) : (
            <p>No lists yet</p>
          )}
        </>
      ) : (
        <Loader spinner text="Loading lists, please wait" />
      )}
    </Container>
  );
};

export default ListPage;
