// src/components/SignUp.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, dbUsers } from "../../firebase";
import { addDoc } from "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setError("passwords do not match");
      return;
    }
    try {
      createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const userId = userCredential.user.uid;
          addDoc(dbUsers, {
            email: email,
            userId: userId,
            date_created: new Date(),
          });
        }
      );
      navigate("/");
    } catch (error) {
      console.log("Error signing up:", error);
      setError(error.slice(5).replace(/-/g, " "));
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Container style={{ minHeight: "50vh" }}>
      <Row style={{ paddingTop: "2rem" }}>
        <Col xs={12}>
          <h5>New User registration</h5>
          <p>Please complete the below</p>
        </Col>
      </Row>
      <br />
      <form onSubmit={handleSignUp}>
        <Row style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Col>
            <ThemedInput
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email Address"
            />
          </Col>
        </Row>
        <Row style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Col>
            <ThemedInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Col>
        </Row>
        <Row style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Col>
            <ThemedInput
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
            />
          </Col>
        </Row>
        <br />
        <Row style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Col>
            <ThemedButton type="submit">Sign Up</ThemedButton>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default SignUp;
