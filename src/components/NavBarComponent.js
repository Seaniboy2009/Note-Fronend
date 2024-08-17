import React, { useContext, useEffect, useState, useRef } from "react";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import AuthContext from "../contexts/AuthContext";
import appStyle from "../styles/App.module.css";
import { Link, NavLink } from "react-router-dom";
import style from "../styles/Header.module.css";
import { useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeSelection";

const NavBarComponent = () => {
  const location = useLocation();
  const navbarRef = useRef(null);

  const { user } = useContext(AuthContext);
  const { activeTheme, theme } = useTheme();
  const linkStyle = { color: theme[activeTheme]?.color };
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
    console.log(navbarOpen);
  };

  const closeNavbar = () => {
    setNavbarOpen(false);
  };

  useEffect(() => {
    console.log("NavbarOpen state:", navbarOpen);
    const handleDocumentClick = (event) => {
      if (
        navbarRef.current &&
        navbarOpen &&
        !navbarRef.current.contains(event.target)
      ) {
        closeNavbar();
      }
    };

    const delayedDocumentClickSetup = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick);
    }, 0);

    return () => {
      clearTimeout(delayedDocumentClickSetup);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [location, navbarOpen]);

  const sideBar = (
    <>
      <Container
        style={{
          backgroundColor: theme[activeTheme].pannelColor,
          border: theme[activeTheme].border,
        }}
        className={appStyle.BackgroundContainer}
      >
        <Row>
          <Col>
            <Link
              style={linkStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              // className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed}`}
            >
              Menu
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link
              to={"/"}
              style={linkStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              href="/"
            >
              <i className="fa-solid fa-house"></i> Home
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link
              to={"/account/"}
              style={linkStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              href="/account"
            >
              <i className="fa-solid fa-user"></i> Account
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );

  const newNavBar = (
    <Container
      fluid
      className={`${style.FixedNavbar}`}
      style={{
        backgroundColor: theme[activeTheme].pannelColor,
        color: theme[activeTheme].color,
      }}
    >
      <Row className="justify-content-md-center">
        <Col xs="auto">
          <Nav.Link
            to="/"
            style={linkStyle}
            as={NavLink}
            className={appStyle.NavButtons}
          >
            Home
          </Nav.Link>
        </Col>
        <Col xs="auto">
          <Nav.Link
            to={"/notes/"}
            style={linkStyle}
            as={NavLink}
            className={appStyle.NavButtons}
          >
            Notes
          </Nav.Link>
        </Col>
        <Col xs="auto">
          <Nav.Link
            to={"/lists/"}
            style={linkStyle}
            as={NavLink}
            className={appStyle.NavButtons}
          >
            List's
          </Nav.Link>
        </Col>
        {user ? (
          <>
            {/* <Col xs="auto">
              <Nav.Link
                to="/sign-out"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign Out
              </Nav.Link>
            </Col> */}
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
            <Col xs="auto">
              <Nav.Link
                to="/sign-up"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign Up
              </Nav.Link>
            </Col>
            <Col xs="auto">
              <Nav.Link
                to="/sign-in"
                style={linkStyle}
                as={NavLink}
                className={appStyle.NavButtons}
              >
                Sign In
              </Nav.Link>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );

  // const oldNavBar = (
  //   <Container
  //     fluid
  //     //ref={navbarRef}
  //     className={`
  //     ${style.NavbarPopout}
  //     ${navbarOpen ? style.open : ""}
  //     `}
  //     style={{
  //       backgroundColor: theme[activeTheme].pannelColor,
  //       color: theme[activeTheme].color,
  //     }}
  //   >
  //     <Row>
  //       <Col>
  //         {user ? <p>DEVMODE: Logged in</p> : <p>DEVMODE: Not logged in</p>}
  //       </Col>
  //     </Row>

  //     <Row
  //       className={`
  //       ${style.Header}
  //       ${style.FixedTop}
  //       "justify-content-md-center"
  //       `}
  //       style={{
  //         backgroundColor: theme[activeTheme].pannelColor,
  //         color: theme[activeTheme].color,
  //         border: theme[activeTheme].border,
  //       }}
  //     >
  //       <Col xs="auto">
  //         <button
  //           style={{
  //             backgroundColor: theme[activeTheme].pannelColor,
  //             color: theme[activeTheme].color,
  //             border: theme[activeTheme].border,
  //           }}
  //           className={appStyle.ButtonNavBar}
  //           onClick={toggleNavbar}
  //         >
  //           <i class="fa-solid fa-ellipsis-vertical"></i>
  //         </button>
  //       </Col>
  //       {user ? (
  //         <>
  //           <Col xs="auto">
  //             <Link
  //               to={"/notes/"}
  //               style={linkStyle}
  //               // onMouseEnter={() => setIsHovered(true)}
  //               // onMouseLeave={() => setIsHovered(false)}
  //               // href="/notes"
  //               //   className={`
  //               // ${isDarkMode ? appStyle.TextTest : appStyle.TextRed}
  //               // ${loc == "/notes/" ? style.Active : null}`}
  //             >
  //               <i className="fa-solid fa-clipboard" />
  //               <p>Notes</p>
  //             </Link>
  //           </Col>
  //           <Col xs="auto">
  //             <Link
  //               to={"/lists/"}
  //               style={linkStyle}
  //               // onMouseEnter={() => setIsHovered(true)}
  //               // onMouseLeave={() => setIsHovered(false)}
  //               // href="/lists"
  //             >
  //               <i className="fa-regular fa-rectangle-list"></i>
  //               <p>List</p>
  //             </Link>
  //           </Col>
  //           <Col xs="auto">
  //             <Link
  //               to={"/test/"}
  //               style={linkStyle}
  //               // onMouseEnter={() => setIsHovered(true)}
  //               // onMouseLeave={() => setIsHovered(false)}
  //               // href="/test"
  //             >
  //               <i className="fa-regular fa-rectangle-list"></i>
  //               <p>DEV</p>
  //             </Link>
  //           </Col>
  //         </>
  //       ) : null}
  //     </Row>
  //     {sideBar}
  //   </Container>
  // );

  return <>{newNavBar}</>;
};

export default NavBarComponent;
