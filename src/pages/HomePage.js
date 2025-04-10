import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
import ThemedButton from "../components/ThemedButton";
import { Spinner } from "react-bootstrap";

const HomePage = () => {
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (userFirestore) {
      setHasLoaded(true);
    }

    setTimeout(() => {
      setHasLoaded(true);
    }, 1000);
  }, [userFirestore]);

  return (
    <Container
      style={{
        color: theme[activeTheme].color,
        textAlign: "center",
        marginTop: "12px",
      }}
    >
      {hasLoaded ? (
        <Container>
          {userFirestore?.user ? (
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
              <Row style={{ paddingBottom: "10px" }}>
                <Col>
                  <Link to={"/lists"}>
                    <ThemedButton>Lists</ThemedButton>
                  </Link>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link to={"/calendar"}>
                    <ThemedButton>Calendar</ThemedButton>
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
                  <p>Please sign up to start using the app</p>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col>
                  <Link to={"/sign-up"}>
                    <ThemedButton>Sign up</ThemedButton>
                  </Link>
                </Col>
              </Row>
              <Row style={{ paddingBottom: "10px" }}>
                <Col>
                  <Link to={"/sign-in"}>
                    <ThemedButton>Log in</ThemedButton>
                  </Link>
                </Col>
              </Row>
            </>
          )}
        </Container>
      ) : (
        <Spinner animation="border" />
      )}
    </Container>
  );
};

export default HomePage;
