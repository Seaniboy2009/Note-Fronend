import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";
import { useUser } from "../../contexts/UserContext";

const AccountPage = () => {
  const userFirestore = useUser();
  const { isDarkMode, changeTheme, activeTheme, theme } = useTheme();

  return (
    <Container>
      <Row>
        <Col>
          <p>Welcome back,</p>
          <p>
            <bold>{userFirestore?.user?.email}</bold>
          </p>
        </Col>
      </Row>
      <Container
        style={{
          backgroundColor: theme[activeTheme].pannelColor,
          border: theme[activeTheme].border,
        }}
        className={appStyle.BackgroundContainer}
      >
        <Row>
          <Col>
            <p>Account Details</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Created: {userFirestore?.dateCreated}</p>
          </Col>
        </Row>
        <br />
        <Row>
          <Col xl={12}>
            <p>Theme</p>
          </Col>
          {Object.entries(theme).map(([themeName, themeProperties], index) => (
            <>
              <Col xs={6}>
                <p key={index}>{themeName}</p>
              </Col>
              <Col xs={6}>
                <input
                  name="theme"
                  className={isDarkMode ? appStyle.TextTest : appStyle.TextRed}
                  checked={activeTheme === themeName}
                  type="radio"
                  onChange={() => changeTheme(themeName)}
                />
              </Col>
            </>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default AccountPage;
