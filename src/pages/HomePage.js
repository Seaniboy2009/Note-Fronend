import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
import ThemedButton from "../components/ThemedButton";

const HomePage = () => {
  const userFirestore = useUser();

  const { activeTheme, theme } = useTheme();

  return (
    <Container
      style={{
        color: theme[activeTheme].color,
        textAlign: "center",
        marginTop: "12px",
      }}
    >
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
    </Container>
  );
};

export default HomePage;
