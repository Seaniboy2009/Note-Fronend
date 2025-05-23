// src/components/SignUp.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, dbUsers } from "../../firebase";
import { addDoc } from "firebase/firestore";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";
import { useTheme } from "../../contexts/ThemeSelection";
import { NavLink } from "react-router-dom";
import appStyle from "../../styles/App.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const { activeTheme, theme } = useTheme();
  const linkStyle = { color: theme[activeTheme]?.color };
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (name.length <= 0) {
      setError("Name must be at least 1 character long");
      return;
    }
    if (email.length <= 0) {
      setError("Email Cant be blank");
      return;
    } else if (!email.includes("@")) {
      setError("Email must be valid");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userId = userCredential.user.uid;

      await addDoc(dbUsers, {
        name: name,
        email: email,
        userId: userId,
        date_created: new Date(),
        existingSubscription: false,
        subscription: {
          plan: "Free",
          active: false,
          startDate: new Date(),
          endDate: null,
        },
      });
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else {
        console.log("Error signing up:", error);
        setError(error.message.slice(5).replace(/-/g, " "));
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Container xl={5} style={{ minHeight: "10vh" }}>
      <Container className="p-4" style={{ maxWidth: "800px" }}>
        <Row
          style={{
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Col xs={12}>
            <h5>New User Registration</h5>
            <p>Please complete the form below</p>
          </Col>
        </Row>
        <form onSubmit={handleSignUp}>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6}>
              <ThemedInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6}>
              <ThemedInput
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email Address"
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6}>
              <ThemedInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6}>
              <ThemedInput
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm Password"
              />
            </Col>
          </Row>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6} className="text-center">
              <ThemedButton type="submit">Create Account</ThemedButton>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6} className="text-center">
              <p style={{ color: theme[activeTheme]?.color }}>
                Already have an account?
              </p>
              <Nav.Link
                to={"/sign-in"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign in
              </Nav.Link>
            </Col>
          </Row>
        </form>
      </Container>
    </Container>
  );
};

export default SignUp;
