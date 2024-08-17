import React, { useContext, useState } from "react";
import style from "../styles/ListDetailPage.module.css";
import appStyle from "../styles/App.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { axiosInstance } from "../api/axiosDefaults";
import AuthContext from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeSelection";
import { Container } from "react-bootstrap";

// const ListItem = ({ id, owner, content, edit, getLists }) => {
const ListItem = ({ item, edit, getLists }) => {
  let { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  const [newContent, setNewContent] = useState("");

  console.log(newContent);
  const {
    id,
    owner,
    content,
    list,
    image_url,
    image,
    is_private,
    toggle,
    timer,
    created,
    updated,
  } = item;

  // Handle the deletion of the list item
  //get lists calls the list function again to refresh page
  const handleDeleteItem = async () => {
    try {
      await axiosInstance.delete(`/api/listitems/${id}`);
      if (getLists) {
        getLists();
      }
    } catch (error) {}
  };

  const handleToggle = async () => {
    try {
      await axiosInstance.patch(`/api/listitems/${id}`, {
        toggle: !toggle,
      });
      if (getLists) {
        getLists();
      }
    } catch (error) {}
  };

  const handleContent = (e) => {
    setNewContent(e.target.value);
  };

  const handleSubmit = async () => {
    if (newContent === "") {
      return;
    }
    console.log("Submitted new content: ", newContent);
    try {
      await axiosInstance.patch(`/api/listitems/${id}`, {
        content: newContent,
      });
      if (getLists) {
        getLists();
      }
    } catch (error) {}
  };

  return (
    <Container className={style.ListContainer}>
      <Row>
        <Col xs={11} className={style.ListItem}>
          <input
            style={{}}
            className={isDarkMode ? appStyle.inputRed : appStyle.inputRed}
            defaultValue={content}
            onChange={handleContent}
            onMouseLeave={handleSubmit}
          ></input>
        </Col>
        <Col
          xs={1}
          className={style.ListItem}
          style={toggle ? { textDecoration: "line-through" } : null}
        >
          <input
            type="checkbox"
            defaultChecked={toggle}
            onChange={handleToggle}
          ></input>
        </Col>
      </Row>
      <Row>
        <Col
          xs={10}
          className={style.ListItemSecondary}
          style={toggle ? { textDecoration: "line-through" } : null}
        >
          <p>{created}</p>
        </Col>
        <Col xs={2} className={style.ListItemSecondary}>
          {owner === user.name && edit === true ? (
            <button
              onClick={() => handleDeleteItem()}
              className={
                isDarkMode ? appStyle.ButtonListItem : appStyle.ButtonListItem
              }
            >
              Delete
            </button>
          ) : null}
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default ListItem;
