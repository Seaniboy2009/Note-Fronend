import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import appStyle from "../styles/App.module.css";
import { NavLink } from "react-router-dom";
import style from "../styles/Header.module.css";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";
import { useUserSettings } from "../contexts/UserSettingsContext";

const NavBarComponent = () => {
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();
  const linkStyle = { color: theme[activeTheme]?.color };
  const { settings } = useUserSettings();
  const useIcons = settings.useIcons;
  console.log(settings);
  const navigationBar = (
    <Container
      fluid
      className={`${style.FixedNavbar}`}
      style={{
        backgroundColor: theme[activeTheme].panelColor,
        color: theme[activeTheme].color,
      }}
    >
      <Row className="justify-content-center">
        <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
          <Nav.Link
            to="/"
            style={linkStyle}
            as={NavLink}
            className={appStyle.NavButtons}
          >
            {useIcons ? <i className="fa-solid fa-house"></i> : "Home"}
          </Nav.Link>
        </Col>
        {userFirestore?.user ? (
          <>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to={"/notes/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                {useIcons ? (
                  <i className="fa-solid fa-note-sticky"></i>
                ) : (
                  "Notes"
                )}
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to={"/lists/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                {useIcons ? (
                  <i className="fa-solid fa-list-check"></i>
                ) : (
                  "Lists"
                )}
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to={"/calendar/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                {useIcons ? (
                  <i className="fa-solid fa-calendar-days"></i>
                ) : (
                  "Calendar"
                )}
              </Nav.Link>
            </Col>
            <Col xs="auto">
              <Nav.Link
                to="/account"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                {useIcons ? <i className="fa-solid fa-user"></i> : "Account"}
              </Nav.Link>
            </Col>
          </>
        ) : (
          <>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to="/sign-up"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign up
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to={"/sign-in"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign in
              </Nav.Link>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );

  return <>{navigationBar}</>;
};

export default NavBarComponent;
