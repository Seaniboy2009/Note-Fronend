import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
import ThemedButton from "../components/ThemedButton";
import { Modal, Spinner } from "react-bootstrap";

const HomePage = () => {
  const { userData, setNewUser } = useUser();
  const newUser = userData?.isNewUser === true;
  const { activeTheme, theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  useEffect(() => {
    if (userData) {
      setHasLoaded(true);
    }

    setTimeout(() => {
      setHasLoaded(true);
    }, 1000);
  }, [userData]);

  const handleCloseModal = () => {
    setNewUser("false"); // Update the newUser state
    localStorage.setItem("newUserState", "false"); // Persist the change
    setShowModal(false); // Close the modal
  };

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
          {userData?.user ? (
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
              {newUser && (
                <Modal
                  show={showModal}
                  onHide={handleCloseModal}
                  dialogClassName="custom-modal" // Add a custom class for the modal
                >
                  <Modal.Header
                    closeButton
                    style={{ backgroundColor: theme[activeTheme].panelColor }}
                  >
                    <Modal.Title style={{ color: theme[activeTheme].color }}>
                      Welcome to the app!
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      backgroundColor: theme[activeTheme].panelColor,
                      color: theme[activeTheme].color,
                    }}
                  >
                    This is a simple note-taking app. You can create notes and
                    lists, and manage your tasks.
                  </Modal.Body>
                  <Modal.Footer
                    style={{ backgroundColor: theme[activeTheme].panelColor }}
                  >
                    <ThemedButton onClick={handleCloseModal}>
                      Close
                    </ThemedButton>
                  </Modal.Footer>
                </Modal>
              )}
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
