import React, { useEffect, useState, useContext } from "react";
import style from "../styles/ListDetailPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { axiosInstance } from "../api/axiosDefaults";
import Modal from "react-bootstrap/Modal";
import Loader from "../components/Loader";
import AuthContext from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeSelection";

const ListItem = ({ id, owner, content, edit, getLists }) => {
  let { user } = useContext(AuthContext);
  const { isDarkMode } = useTheme();

  // Handle the deletion of the list item
  const handleDeleteItem = async () => {
    try {
      await axiosInstance.delete(`/api/listitems/${id}`);
      if (getLists) {
        getLists();
      }
    } catch (error) {}
  };

  return (
    <Row className={style.ListContainer}>
      <Col>
        <p>{content}</p>
      </Col>
      {owner === user.name && edit === true ? (
        <Col xs={3}>
          <button
            onClick={() => handleDeleteItem()}
            className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}
          >
            Remove
          </button>
        </Col>
      ) : null}
    </Row>
  );
};

export default ListItem;
