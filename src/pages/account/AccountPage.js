import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../utils/ThemeSelection";

const AccountPage = () => {
  let { user, expire } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Container>
      <Container>
        <Row
          className={`${
            isDarkMode
              ? appStyle.BackgroundContainerTest
              : appStyle.BackgroundContainerSmallRed
          }`}
        >
          <Col>
            <h5>Name: {user.name}</h5>
            <p>Login expires: {expire}</p>
            {console.log(user)}
            {console.log(expire)}
          </Col>
        </Row>
        <Row
          className={`${
            isDarkMode
              ? appStyle.BackgroundContainerTest
              : appStyle.BackgroundContainerSmallRed
          }`}
        >
          <Col xl={12}>
            <p>Theme</p>
          </Col>
          <Col>
            <p>Light</p>
          </Col>
          <Col>
            <input
              className={isDarkMode ? appStyle.TextTest : appStyle.TextRed}
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default AccountPage;
