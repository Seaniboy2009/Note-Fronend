import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";

const AccountPage = () => {
  let { user, expire } = useContext(AuthContext);
  const { isDarkMode, changeTheme, activeTheme, theme } = useTheme();

  return (
    <Container
      style={{
        backgroundColor: theme[activeTheme].pannelColor,
        border: theme[activeTheme].border,
      }}
      className={appStyle.BackgroundContainer}
    >
      <Row>
        <Col>
          <h5>Name: {user.name}</h5>
          <p>Login expires: {expire}</p>
        </Col>
      </Row>
      <br />
      <Row>
        <Col xl={12}>
          <p>Theme</p>
        </Col>
        {Object.entries(theme).map(([themeName, themeProperties], index) => (
          <>
            <Col xl={6}>
              <p key={index}>{themeName}</p>
            </Col>
            <Col xl={6}>
              <input
                name="theme"
                className={isDarkMode ? appStyle.TextTest : appStyle.TextRed}
                checked={activeTheme === themeName}
                type="radio"
                // checked={isDarkMode}
                // onChange={toggleDarkMode}
                onChange={() => changeTheme(themeName)}
              />
            </Col>
          </>
        ))}
        {/* <Col>
          <input
            className={isDarkMode ? appStyle.TextTest : appStyle.TextRed}
            type="checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        </Col> */}
      </Row>
    </Container>
  );
};

export default AccountPage;
