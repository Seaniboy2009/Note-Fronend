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

const isLargeScreen = window.innerWidth >= 768; // Check screen width
const iconSize = isLargeScreen ? "30px" : "25px";
const NavBarComponent = () => {
  const { userDetails } = useUser();
  const { activeTheme, theme } = useTheme();
  const linkStyle = { color: theme[activeTheme]?.color };
  const { settings } = useUserSettings();
  const useIcons = settings.useIcons;
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
            {useIcons ? (
              <i
                className="fa-solid fa-house"
                style={{ fontSize: iconSize }}
              ></i>
            ) : (
              "Home"
            )}
          </Nav.Link>
        </Col>
        {userDetails?.user ? (
          <>
            <Col xs="auto" style={{ paddingRight: useIcons ? "5px" : "1px" }}>
              <Nav.Link
                to={"/notes/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                {useIcons ? (
                  <i
                    className="fa-solid fa-note-sticky"
                    style={{ fontSize: iconSize }}
                  ></i>
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
                  <i
                    className="fa-solid fa-list-check"
                    style={{ fontSize: iconSize }}
                  ></i>
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
                  <i
                    className="fa-solid fa-calendar-days"
                    style={{ fontSize: iconSize }}
                  ></i>
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
                {useIcons ? (
                  <i
                    className="fa-solid fa-user"
                    style={{ fontSize: iconSize }}
                  ></i>
                ) : (
                  "Account"
                )}
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
