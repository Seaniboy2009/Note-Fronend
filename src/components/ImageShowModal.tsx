import React from "react";
import { Modal } from "react-bootstrap";

interface ImageModalProps {
  show: boolean;
  imageSrc: string;
  onClose: () => void;
}

// Define a single style object for the image
const modalStyles = {
  image: {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "auto", // Maintain aspect ratio
    maxWidth: "1200px", // Set a maximum width for larger images
    maxHeight: "90vh", // Ensure the image doesn't overflow the viewport height
    objectFit: "contain", // Ensure the image fits without cropping
    transform: "scale(1.5)", // Scale the image to 150% of its size
    transformOrigin: "center", // Keep the scaling centered
  },
};

const ImageShowModal: React.FC<ImageModalProps> = ({
  show,
  imageSrc,
  onClose,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body style={{ padding: 0 }}>
        <img
          src={imageSrc}
          alt="Enlarged view"
          style={modalStyles.image as React.CSSProperties} // Apply image styles
        />
      </Modal.Body>
    </Modal>
  );
};

export default ImageShowModal;
