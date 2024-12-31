import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

// Show a spinner icon and text when loading data
const Loader = ({ spinner, text }) => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Row>
        <Col xs={12}> {text ? <p>{text}</p> : null}</Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center", marginTop: "20px" }}>
          {" "}
          {spinner ? <Spinner animation="border" /> : null}
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
