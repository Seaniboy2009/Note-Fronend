// src/components/SignUp.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import style from "../../styles/App.module.css";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const user = useUser();
  let navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
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
    <Container style={{ minHeight: "50vh" }}>
      <Row style={{ paddingTop: "2rem" }}>
        <Col>
          <h5>Welcome Back</h5>
          <p>Enter your credentials for login</p>
        </Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <Col xs={12}>
          <form onSubmit={handleSignUp}>
            <Row>
              <Col>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </Col>
            </Row>
            <br />
            <Row className="justify-content-md-center">
              <Col>
                <Button className={style.Button} type="submit">
                  Sign in
                </Button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
