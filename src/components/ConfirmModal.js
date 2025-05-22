import React from "react";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../contexts/ThemeSelection";
import { Col, Container, Modal, Row } from "react-bootstrap";
const ConfirmationModal = ({ show, onClose, onConfirm, message }) => {
  const { theme, activeTheme } = useTheme();
  if (!show) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        closeButton
        onHide={onClose}
        style={{ backgroundColor: theme[activeTheme].panelColor }}
      >
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: theme[activeTheme].panelColor }}>
        <Container>
          <Row>
            <Col>{message || "No message"}</Col>
          </Row>
          <Row className="mt-3">
            <Col className="d-flex justify-content-end">
              <ThemedButton onClick={onConfirm}>Confirm</ThemedButton>
            </Col>
            <Col className="d-flex justify-content-start">
              <ThemedButton onClick={onClose}>Cancel</ThemedButton>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmationModal;
