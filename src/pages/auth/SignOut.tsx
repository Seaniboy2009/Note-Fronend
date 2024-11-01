// src/components/SignUp.js
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SignOut: React.FC = () => {
  let navigate = useNavigate();
  const user = auth.currentUser;

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signOut(auth)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Sign out</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={handleSignOut} type="submit">
            Sign out
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>[WIP REMOVE]{user ? user.email : "No user"}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default SignOut;
