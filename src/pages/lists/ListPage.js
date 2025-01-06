import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../styles/ListPage.module.css";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosInstance } from "../../api/axiosDefaults";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUser } from "../../contexts/UserContext";
import { getDocs, query, where } from "firebase/firestore";
import { dbLists } from "../../firebase";
import Loader from "../../components/Loader";
import { useTheme } from "../../contexts/ThemeSelection";
import { fetchMoreData } from "../../utils/utils";
import ThemedButton from "../../components/ThemedButton";

const useNewDb = true; // ***********TODO remove this once new db is fully implemented**********

const ListPage = () => {
  const [myLists, setMyLists] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();

  useEffect(() => {
    const handleGetLists = async () => {
      try {
        if (useNewDb) {
          const queryLists = query(
            dbLists,
            where("userId", "==", userFirestore.user.uid)
          );
          const querySnapshot = await getDocs(queryLists);
          console.log("querySnapshot:", querySnapshot);

          const userUpdatedResponse = querySnapshot.docs.map((doc) => {
            const data = doc.data();

            // Check and normalize `date_created`
            let dateCreated = null;
            if (data.date_created) {
              if (
                typeof data.date_created === "object" &&
                "seconds" in data.date_created
              ) {
                // Convert Firestore timestamp to ISO string
                dateCreated = new Date(
                  data.date_created.seconds * 1000
                ).toISOString();
              } else {
                // Assume it's already an ISO string
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
          console.log(
            "Get my lists data unsortedResponse:",
            userUpdatedResponse
          );
          console.log("Get my lists data sortedResponse:", sortedResponse);
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
      handleGetLists();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [userFirestore]);

  return (
    <Container className={`text-center`}>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              <Link to={"/"}>
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
            </Col>
            <Col xs={10}>
              <h4>Lists</h4>
            </Col>
          </Row>
          <br />
          {userFirestore?.user ? (
            <Row>
              <Col xs={5}>
                <Link to={"list/create"}>
                  <button className={appStyle.ButtonCreate}>
                    <i className="fa-sharp fa-solid fa-plus" />
                  </button>
                </Link>
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
                      className={style.listObject}
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
