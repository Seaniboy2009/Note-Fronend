import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import ThemedButton from "../../components/ThemedButton";
import ThemedInput from "../../components/ThemedInput";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorCode.slice(5).replace(/-/g, " "));
          console.log("Error signing In:", errorCode, errorMessage);
        });
    } catch (error) {
      console.log("Error signing In:", error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "10vh" }}
    >
      <Container className="p-4" style={{ maxWidth: "800px" }}>
        <Row
          style={{
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Col>
            <h5>Welcome Back</h5>
            <p>Enter your credentials for login</p>
          </Col>
        </Row>
        <form onSubmit={handleSignIn}>
          <Row className="justify-content-center mb-3">
            <Col xs={12} sm={10} md={8} lg={6}>
              <ThemedInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Col xs={12} sm={10} md={8} lg={6} className="text-center">
              <ThemedButton type="submit">Log in</ThemedButton>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Col>
          </Row>
        </form>
      </Container>
    </Container>
  );
};

export default SignIn;
