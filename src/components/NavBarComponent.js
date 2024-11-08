import React from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import appStyle from "../styles/App.module.css";
import { Link, NavLink } from "react-router-dom";
import style from "../styles/Header.module.css";
import { useTheme } from "../contexts/ThemeSelection";
import { useUser } from "../contexts/UserContext";

const NavBarComponent = () => {
  const userFirestore = useUser();
  const { activeTheme, theme } = useTheme();
  const linkStyle = { color: theme[activeTheme]?.color };

  const navigationBar = (
    <Container
      fluid
      className={`${style.FixedNavbar}`}
      style={{
        backgroundColor: theme[activeTheme].pannelColor,
        color: theme[activeTheme].color,
      }}
    >
      <Row className="justify-content-center">
        <Col xs="auto" style={{ paddingRight: "1px" }}>
          <Nav.Link
            to="/"
            style={linkStyle}
            as={NavLink}
            className={appStyle.NavButtons}
          >
            Home
          </Nav.Link>
        </Col>
        {userFirestore?.user ? (
          <>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
              <Nav.Link
                to={"/notes/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Notes
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
              <Nav.Link
                to={"/lists/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                List's
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
              <Nav.Link
                to={"/calendar/"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Calendar
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
              <Nav.Link
                to={"/sign-out"}
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign out
              </Nav.Link>
            </Col>
            <Col xs="auto">
              <Nav.Link
                to="/account"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Account
              </Nav.Link>
            </Col>
          </>
        ) : (
          <>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
              <Nav.Link
                to="/sign-up"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign up
              </Nav.Link>
            </Col>
            <Col xs="auto" style={{ paddingRight: "1px" }}>
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
