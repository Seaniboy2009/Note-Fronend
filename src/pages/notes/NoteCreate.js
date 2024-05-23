import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import appStyle from "../../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosInstance } from "../../api/axiosDefaults";
import SearchPage from "../SearchPage";
import { useTheme } from "../../contexts/ThemeSelection";

const NoteCreate = () => {
  const navigate = useNavigate();
  const imageInput = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Other",
    image: "",
    image_url: "",
    is_private: false,
  });

  const { title, category, is_private } = formData;
  const [submit, setSubmit] = useState(false);
  const [search, setQueryGlobal] = useState("");
  const [pickImage, setPickImage] = useState(true);
  const { isDarkMode } = useTheme();

  const createNote = async () => {
    const formDataSend = new FormData();

    formDataSend.append("title", title);
    formDataSend.append("category", category);
    formDataSend.append("is_private", is_private);

    console.log("Type of image:", typeof formData.image);
    console.log("Type of image_url:", typeof formData.image_url);

    if (formData.image) {
      // Assuming formData.image is a local file
      formDataSend.append("image", formData.image);
    } else if (formData.image_url) {
      // If formData.image is falsy, check formData.image_url
      formDataSend.append("image_url", formData.image_url);
    } else {
      console.error("Either image or image_url must be provided");
      console.log("Form Data:", formData);
      // return;
    }

    console.log("Form Data:", formData); // Log the form data

    try {
      setSubmit(true);
      await axiosInstance.post("/api/notes/", formDataSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Use 'multipart/form-data' for FormData
        },
      });
      setSubmit(false);
      navigate("/notes/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    if (event.target.name === title) {
      setQueryGlobal(event.target.value);
    }
    console.log(formData);
  };

  const handleChecked = (event) => {
    setFormData({ ...formData, is_private: event.target.checked });
    console.log(formData);
  };

  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      image: file,
      image_url: "", // Reset the image_url field
    });
    console.log("Form Data:", formData);
  };

  const pickedImage = (imageUrl) => {
    console.log("Picked image URL:", imageUrl);
    setFormData({
      ...formData,
      image_url: imageUrl,
      image: null, // Reset the image field
    });
    console.log("Form Data:", formData);
  };

  const handlePickImage = () => {
    if (pickImage) {
      setPickImage(false);
    } else {
      setPickImage(true);
    }
  };

  const submittingText = (
    <Container>
      <Row>
        <Col>
          <h4>Please wait..Submitting</h4>
        </Col>
      </Row>
    </Container>
  );

  const defaultText = (
    <Container>
      <Row>
        <Col xs={10}>
          <Link to={"/notes/"}>
            <i className="fa-solid fa-arrow-left" />
            &nbsp;
          </Link>
        </Col>
      </Row>
      <Row
        className={`${
          isDarkMode
            ? appStyle.BackgroundContainerTest
            : appStyle.BackgroundContainerSmallRed
        }`}
      >
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title">
              <h5>Title</h5>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              id="title"
              aria-describedby="title"
              onChange={handleChange}
            />
            <br />
            <Form.Label htmlFor="category">
              <h5>Category</h5>
            </Form.Label>
            <Form.Control
              as="select"
              name="category"
              id="category"
              aria-describedby="category"
              onChange={handleChange}
            >
              <option value="Other">Other</option>
              <option value="Game">Game</option>
              <option value="Movie">Movie</option>
            </Form.Control>
            <br />
            <Form.Label htmlFor="image">
              <h5>Image</h5>
            </Form.Label>
            <Form.Control
              type="file"
              name="image"
              id="image"
              onChange={handleChangeImage}
              ref={imageInput}
            />
            <br />
            <Form.Check
              type="checkbox"
              name="is_private"
              id="is_private"
              label="Set Private?"
              onChange={handleChecked}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row
        className={`${
          isDarkMode
            ? appStyle.BackgroundContainerTest
            : appStyle.BackgroundContainerSmallRed
        }`}
      >
        <Col>
          <button
            onClick={createNote}
            className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}
          >
            Submit
          </button>
        </Col>
        <Col>
          <button
            onClick={handlePickImage}
            className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}
          >
            Recomendations
          </button>
        </Col>
      </Row>
      {/* Search page */}
      <Row>
        {pickImage ? (
          <SearchPage
            searchText={title}
            searchPage
            category={category}
            pickedImage={pickedImage}
          />
        ) : null}
      </Row>
    </Container>
  );

  return (
    <Container fluid className={appStyle.Container}>
      {submit ? submittingText : defaultText}
    </Container>
  );
};

export default NoteCreate;
