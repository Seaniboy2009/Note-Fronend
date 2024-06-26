import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "../styles/NoteItem.module.css";
import appStyle from "../styles/App.module.css";
import { axiosInstance } from "../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AuthContext from "../contexts/AuthContext";
import Form from "react-bootstrap/Form";
import { useTheme } from "../contexts/ThemeSelection";

const NoteItem = (props) => {
  const {
    id,
    title,
    owner,
    created,
    updated,
    image,
    image_url,
    details,
    detailPage,
    is_private,
    toggle,
    category,
    grid,
  } = props;

  let { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [edit, setEdit] = useState(false);

  const [formData, setFormData] = useState({
    newTitle: title,
    newIs_private: is_private,
    newToggle: toggle,
    newCategory: category,
    newDetails: details,
    image: image,
  });
  const { newTitle, newIs_private, newToggle, newCategory, newDetails } =
    formData;

  const navigate = useNavigate();
  // handle this note deletion when in edit mode
  const handleDelete = async () => {
    await axiosInstance.delete(`/api/notes/${id}`);
    navigate("/notes/");
  };
  // handle title change and update its state when in edit mode
  const handleUpdate = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log("Form data updating:", formData);
  };
  // handle any checkbox and update its state when in edit mode
  const handleChecked = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.checked });
    console.log("Form data updating:", formData);
  };

  // Check the category of the note and retun the word to be used for the checked box
  const checkCategory = () => {
    var categoryToCheck = category;
    let result;

    // this will check categoryToCheck and see if its the same as each case and return the word to use
    switch (categoryToCheck) {
      case "Other":
        return "Other";
      case "Game":
        return "Played";
      case "Movie":
        return "Watched";
      default:
        return "Invalid category";
    }

    console.log(result);
    return result;
  };
  // this will update the current note and will send the title, is private and toggle to be updated by the api
  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("is_private", newIs_private);
    formData.append("toggle", newToggle);
    formData.append("category", newCategory);
    formData.append("details", newDetails);

    try {
      await axiosInstance.put(`/api/notes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Use 'multipart/form-data' for FormData
        },
      });
      console.log("Form data sent:", formData);
      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  // this will toggle between edit mode enabled and disabled
  const toggleEditMode = () => {
    setEdit(!edit);
    console.log("Current edit", edit);
    if (edit) {
      console.log("edit mode enabled");
    } else {
      console.log("edit mode disabled: save to DB");
    }
  };

  const imageContainer = (
    <Container
      className={` text-left  ${
        isDarkMode
          ? appStyle.BackgroundContainerTest
          : appStyle.BackgroundContainerRed
      }`}
    >
      <Row style={{ fontWeight: 700, fontfamily: "Gill Sans", fontSize: 25 }}>
        <Col>Note Image</Col>
      </Row>
      <Row>
        <Col>
          {image_url ? (
            <img
              src={image_url}
              className={style.ImageDetail}
              alt="note image"
            />
          ) : (
            <img src={image} className={style.ImageDetail} alt="note image" />
          )}
        </Col>
      </Row>
    </Container>
  );
  // all normal text will be conveted to input so the user can then change the note
  const editModeEnabled = (
    <Container
      className={` text-left ${
        isDarkMode
          ? appStyle.BackgroundContainerTest
          : appStyle.BackgroundContainerRed
      }`}
    >
      <Row>
        <Col>
          <p>
            Title:{" "}
            <input
              type="text"
              defaultValue={title}
              onChange={handleUpdate}
              className={style.NoteInputRed}
              name="newTitle"
            />
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Category:
            <Form.Control
              as="select"
              name="newCategory"
              defaultValue={category}
              onChange={handleUpdate}
            >
              <option value="Other">Other</option>
              <option value="Game">Game</option>
              <option value="Movie">Movie</option>
            </Form.Control>
          </p>
        </Col>
      </Row>
      {/* <Row><p>Details: <input type='text' defaultValue={details} onChange={handleUpdate} className={style.NoteInputRed} name='newDetails'/></p></Row> */}
      <Row>
        <Col>
          <p>
            Private:{" "}
            <input
              type="checkbox"
              name="newIs_private"
              defaultChecked={is_private}
              defaultValue={true}
              onChange={handleChecked}
              // className={appStyle.CheckBoxRed}
            />{" "}
            {is_private ? "Yes" : "No"}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            {checkCategory()}:{" "}
            <input
              type="checkbox"
              name="newToggle"
              defaultChecked={toggle}
              defaultValue={true}
              onChange={handleChecked}
            />{" "}
            {toggle ? "Yes" : "No"}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Created: {created}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>Updated: {updated}</p>
        </Col>
      </Row>
      <Row>
        <button
          className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}`}
          onClick={handleFormSubmit}
        >
          Save
        </button>
      </Row>
    </Container>
  );
  // normal text to be shown when edit is disabled, cant edit anything
  const editModeDisabled = (
    <Container
      className={` text-left  ${
        isDarkMode
          ? appStyle.BackgroundContainerTest
          : appStyle.BackgroundContainerRed
      }`}
    >
      <Row style={{ fontWeight: 700, fontfamily: "Gill Sans", fontSize: 25 }}>
        <Col>Note Details</Col>
      </Row>
      <Row style={{ fontWeight: 600, fontfamily: "Gill Sans" }}>
        <Col>
          <p>Title</p>
        </Col>
        <Col>
          <p>Category</p>
        </Col>
        <Col>
          <p>Private</p>
        </Col>
      </Row>
      <Row style={{ fontWeight: 400, fontfamily: "Gill Sans" }}>
        <Col>
          <p>{title}</p>
        </Col>
        <Col>
          <p>{category}</p>
        </Col>
        <Col>
          <p>{is_private ? "Yes" : "No"}</p>
        </Col>
      </Row>
      <Row style={{ fontWeight: 600, fontfamily: "Gill Sans" }}>
        <Col>
          <p>{checkCategory()}</p>
        </Col>
        <Col>
          <p>Created</p>
        </Col>
        <Col>
          <p>Updated</p>
        </Col>
      </Row>
      <Row style={{ fontWeight: 400, fontfamily: "Gill Sans" }}>
        <Col>
          <p>{toggle ? "Yes" : "No"}</p>
        </Col>
        <Col>
          <p>{created}</p>
        </Col>
        <Col>
          <p>{updated}</p>
        </Col>
      </Row>
    </Container>
  );
  // Layout for the notes detail page
  const noteDetailPage = (
    <>
      <Row>
        <Col xs={8}>
          <Link to={"/notes/"}>
            <i className="fa-solid fa-arrow-left" />
            &nbsp;
          </Link>
        </Col>
        <Col xs={2}>
          <button
            className={`${
              isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
            } fa-solid fa-pen-to-square`}
            style={{ minWidth: "11vh" }}
            onClick={toggleEditMode}
          ></button>
        </Col>
      </Row>
      {owner.id === user.id ? (
        edit ? (
          editModeEnabled
        ) : (
          editModeDisabled
        )
      ) : (
        <Row
          className={
            isDarkMode ? appStyle.NoteDetailsTest : appStyle.NoteDetailsRed
          }
        >
          <Col md={3}>
            <p>Title: {title}</p>
          </Col>
          <Col md={3}>
            <p>Details: {details}</p>
          </Col>
        </Row>
      )}
      {imageContainer}
    </>
  );
  // layout for the notes list page
  const noteListPage = grid ? (
    <Link to={`note/${id}`} className={style.Link}>
      {image_url ? (
        <img src={image_url} className={style.ImageGrid} alt="note image" />
      ) : (
        <img src={image} className={style.ImageGrid} alt="note image" />
      )}
    </Link>
  ) : (
    <Link to={`note/${id}`} className={style.Link}>
      <Row className={isDarkMode ? style.NoteTest : style.NoteRed}>
        <Col xs={5}>
          {image_url ? (
            <img src={image_url} className={style.ImageList} alt="note image" />
          ) : (
            <img src={image} className={style.ImageList} alt="note image" />
          )}
        </Col>
        <Col fluid>Title: {title}</Col>
        <Col xs={2}>
          {is_private ? (
            <i className={`fa-solid fa-lock ${style.Private}`}></i>
          ) : null}
          {toggle ? (
            <i className={`fa-solid fa-eye ${style.Watched}`}></i>
          ) : null}
        </Col>
      </Row>
    </Link>
  );

  return detailPage ? (
    <>
      <Container>{noteDetailPage}</Container>
    </>
  ) : (
    <>{noteListPage}</>
  );
};

export default NoteItem;
