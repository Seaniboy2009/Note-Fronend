import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import appStyle from "../../styles/App.module.css";
import { useTheme } from "../../contexts/ThemeSelection";
import { useUser } from "../../contexts/UserContext";

const AccountPage = () => {
  const userFirestore = useUser();
  const { isDarkMode, changeTheme, activeTheme, theme } = useTheme();
  const admin = userFirestore?.admin || false;
  const advancedUser = userFirestore?.advancedUser || false;

  return (
    <Container style={{ marginBottom: admin ? 100 : undefined }}>
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

            {advancedUser && <p>Advanced User</p>}
          </Col>
          {Object.entries(theme).map(([themeName], index) => (
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
      {admin && (
        <Container
          style={{
            backgroundColor: theme[activeTheme].pannelColor,
            border: theme[activeTheme].border,
          }}
          className={appStyle.BackgroundContainer}
        >
          <Row>
            <Col>
              <p> {admin && <p>Admin</p>}</p>
            </Col>
          </Row>

          {Object.entries(userFirestore).map(([key, value]) => (
            <Row style={{ padding: "5px", textAlign: "left" }}>
              {" "}
              <Col key={key}>
                <strong>{key}:</strong>{" "}
                {typeof value === "object" && !Array.isArray(value) ? (
                  // If it's an object, format its properties
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                ) : Array.isArray(value) ? (
                  // If it's an array, handle accordingly
                  <pre>{JSON.stringify(value, null, 2)}</pre>
                ) : (
                  // For primitive values
                  value.toString()
                )}
              </Col>
            </Row>
          ))}
        </Container>
      )}
    </Container>
  );
};

export default AccountPage;
