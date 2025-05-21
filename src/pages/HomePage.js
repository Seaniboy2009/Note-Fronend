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
  const { userDetails } = useUser();
  const newUser = localStorage.getItem(`newUserState_${userDetails?.user?.uid}`)
    ? localStorage.getItem(`newUserState_${userDetails?.user?.uid}`) === "true"
    : true; // Default to true if not set

  const { activeTheme, theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showModal, setShowModal] = useState(true);
  useEffect(() => {
    if (userDetails) {
      setHasLoaded(true);
    }

    setTimeout(() => {
      setHasLoaded(true);
    }, 1000);
  }, [userDetails]);

  const handleCloseModal = () => {
    localStorage.setItem(`newUserState_${userDetails.user?.uid}`, "false"); // Persist the change
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
          {userDetails?.user ? (
            <>
              <Row style={{ paddingBottom: "20px" }}>
                <Col>
                  <h4>
                    Welcome back{" "}
                    {userDetails.user.name || userDetails.user.email}
                  </h4>
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
                  dialogClassName="custom-modal"
                >
                  <Modal.Header
                    style={{
                      backgroundColor: theme[activeTheme].panelColor,
                      border: "none",
                    }}
                  >
                    <Modal.Title
                      style={{
                        color: theme[activeTheme].color,
                        border: "none",
                      }}
                    >
                      Welcome to the app!
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body
                    style={{
                      backgroundColor: theme[activeTheme].panelColor,
                      color: theme[activeTheme].color,
                    }}
                  >
                    You can organize your thoughts with notes and lists.
                    <br />
                    Easily schedule your notes on your calendar.
                    <br />
                    You can mange your account settings in the account page.
                    change theme and enable / disable icons
                  </Modal.Body>
                  <Modal.Footer
                    style={{
                      backgroundColor: theme[activeTheme].panelColor,
                      border: "none",
                    }}
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
