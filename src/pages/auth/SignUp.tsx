// src/components/SignUp.js
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, dbUsers } from "../../firebase";
import { addDoc } from "firebase/firestore";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import style from "../../styles/App.module.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setError("passwords do not match");
      return;
    }
    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const userId = userCredential.user.uid;
          addDoc(dbUsers, {
            email: email,
            userId: userId,
            date_created: new Date(),
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log("Error signing up:", error.code);
          setError(errorCode.slice(5).replace(/-/g, " "));
        });
      navigate("/");
    } catch (error) {
      console.log("Error signing up:", error);
    }
  };

  return (
    <Container style={{ minHeight: "50vh" }}>
      <Row style={{ paddingTop: "2rem" }}>
        <Col xs={12}>
          <h5>New customer registration</h5>
          <p>Please complete the below form</p>
        </Col>
      </Row>
      <br />
      <form onSubmit={handleSignUp}>
        <Row style={{ textAlign: "center" }}>
          <Col>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />
          </Col>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Col>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </Col>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Col>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Confirm Password"
            />
          </Col>
        </Row>
        <br />
        <Row className={`justify-content-md-center`}>
          <Col>
            <Button className={style.Button} type="submit">
              Create account
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </Col>
        </Row>
      </form>
    </Container>
  );
};

export default SignUp;
