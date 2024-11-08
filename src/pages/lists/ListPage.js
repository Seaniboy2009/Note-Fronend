import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../../styles/ListPage.module.css";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosInstance } from "../../api/axiosDefaults";
import { useUser } from "../../contexts/UserContext";
import { getDocs, query, where } from "firebase/firestore";
import { dbLists } from "../../firebase";
import Loader from "../../components/Loader";
import { useTheme } from "../../contexts/ThemeSelection";

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
          const userUpdatedResponse = querySnapshot.docs.map((doc) => ({
            docId: doc.id, // Firestore document ID
            ...doc.data(), // Document data
          }));
          setMyLists({ results: userUpdatedResponse });
          console.log("Get my lists data:", userUpdatedResponse);
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
    <Container fluid className={`text-center ${appStyle.Container}`}>
      {hasLoaded ? (
        <>
          <Row>
            <Col xs={1}>
              <Link to={"/"}>
                <i className="fa-solid fa-arrow-left"></i>
              </Link>
            </Col>
            <Col xs={10}>
              <h4>Lists</h4> <p> {useNewDb && "Using new db"}</p>
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

          {myLists?.results?.map((list, index) => (
            <Container
              style={{
                backgroundColor: theme[activeTheme].pannelColor,
                border: theme[activeTheme].border,
              }}
              className={` text-left  ${appStyle.BackgroundContainer}`}
            >
              <Link key={list.id} to={`list/${list.docId}`}>
                <Row>
                  <Col xs={10}>
                    <h5 className={style.ListDetails}>{list.title}</h5>
                  </Col>
                  <Col>
                    {list.is_private ? (
                      <i className={`fa-solid fa-lock ${style.Private}`}></i>
                    ) : null}
                  </Col>
                </Row>
              </Link>
            </Container>
          ))}
        </>
      ) : (
        <Loader spinner text="Loading lists, please wait" />
      )}
    </Container>
  );
};

export default ListPage;
