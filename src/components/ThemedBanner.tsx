import React from "react";
import { Col, Container, Row } from "react-bootstrap";
type BannerProps = {
  message: string;
  type: string;
};

const ThemedBanner: React.FC<BannerProps> = ({ message, type }) => {
  const getTypeStyles = () => {
    switch (type) {
      case "event":
        return { backgroundColor: "green", color: "white" };
      case "message":
        return { backgroundColor: "rgb(0, 123, 255)", color: "white" };
      default:
        return { backgroundColor: "gray", color: "white" };
    }
  };
  return (
    <Container>
      <Row
        className="justify-content-center"
        style={{
          backgroundColor: getTypeStyles().backgroundColor,
          padding: "20px",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          margin: "20px 0",
        }}
      >
        <Col style={{ padding: 0 }}>{message}</Col>
      </Row>
    </Container>
  );
};

export default ThemedBanner;
