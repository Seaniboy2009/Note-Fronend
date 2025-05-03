import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const Loader = ({ spinner, text }) => {
  return (
    <Container style={{ textAlign: "center", marginTop: "20px" }}>
      <Row>
        <Col xs={12}> {text ? <p>{text}</p> : null}</Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center", marginTop: "20px" }}>
          {spinner ? <Spinner animation="border" /> : null}
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;
