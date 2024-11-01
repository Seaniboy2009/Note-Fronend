import React, { useEffect, useState } from "react";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosDefaults";

import Loader from "../components/Loader";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
import ThemedButton from "../components/ThemedButton";

const HomePage = () => {
  const userFirestore = useUser();
  const [loaded, setLoaded] = useState(false);

  const { activeTheme, theme, isDarkMode } = useTheme();

  useEffect(() => {
    const loadApp = async () => {
      try {
        const data = await axiosInstance.get(`/`);
        const status = data.status;
        // console.log(status);
        if (status === 200) {
          // console.log(`${status} OK`);
          setLoaded(true);
        } else if (status === 404) {
          console.log(`${status} not found`);
        } else if (status === 500) {
          console.log(`${status} server error`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(() => {
      if (loaded === false) {
        loadApp();
      }
    }, 1000);

    const load = setInterval(() => {
      if (loaded === false) {
        console.log("App not loaded");
        loadApp();
      } else {
        console.log("App loaded");
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(load);
    };
  }, [loaded]);

  return (
    <Container
      style={{
        color: theme[activeTheme].color,
        textAlign: "center",
        marginTop: "12px",
      }}
    >
      {loaded ? (
        <Container>
          {userFirestore.user ? (
            <>
              <Row style={{ paddingBottom: "20px" }}>
                <Col>
                  <h4>Welcome</h4>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col>
                  <Link to={"/notes"}>
                    <ThemedButton>Notes</ThemedButton>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link to={"/lists"}>
                    <ThemedButton>Lists</ThemedButton>
                  </Link>
                </Col>
              </Row>
              <br />
            </>
          ) : (
            <>
              {" "}
              <Row style={{ paddingBottom: "20px" }}>
                <Col>
                  <h4>Welcome</h4>
                  <h5>Please sign up to start using the app</h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link to={"/sign-up"}>
                    <ThemedButton> Sign up</ThemedButton>
                  </Link>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col>
                  <Link to={"/sign-in"}>
                    <p> Log in</p>
                  </Link>
                </Col>
              </Row>
            </>
          )}
        </Container>
      ) : (
        <Loader spinner text="Loading App, Please wait" />
      )}
    </Container>
  );
};

export default HomePage;
