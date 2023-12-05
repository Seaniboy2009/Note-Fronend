import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import AuthContext from '../contexts/AuthContext'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import appStyle from '../styles/App.module.css'
import style from '../styles/Header.module.css'
import { useLocation } from 'react-router-dom';
import { useTheme } from '../utils/ThemeSelection';

const NavBarComponent = () => {

  const location = useLocation()
  const [loc, setLoc] = useState()

  let {user} = useContext(AuthContext)
  const {isDarkMode, toggleDarkMode} = useTheme()

  useEffect(() => {
    setLoc(location.pathname)
    console.log(location)
  }, [location])

  // show the buttons and links for sign in user
  const signedIn = (
    <Row xs={12}>
      <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/notes/' ? style.Active : null)}`} href="/notes/">Notes</Nav.Link></Col>
      <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/lists/' ? style.Active : null)}`} href="/lists/">Lists</Nav.Link></Col>
      {/* <Col>
        <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/test/' ? style.Active : null)}`} href="/test/">Test</Nav.Link>
      </Col>
      <Col>
        <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/all/' ? style.Active : null)}`} href="/all/">All</Nav.Link>
      </Col> */}
      <Col>
        <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/account/' ? style.Active : null)}`} href="/account/">Account</Nav.Link>
      </Col>
    </Row>
  )
  
  // Show the buttons and links for none signed in user
  const notSignedIn = (
    <>
      <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/' ? style.Active : null)}`}  href="/">Sign in</Nav.Link>
      <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/register/' ? style.Active : null)}`}  href="/register/">Sign up</Nav.Link>
    </>
  )

  return (
    <Container fluid="xs"
    className={`
      ${style.Header}
      ${style.FixedTop}
      ${isDarkMode ? appStyle.HeaderThemeTest : appStyle.HeaderThemeRed}
    `}>
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Col><Nav.Link className={isDarkMode ? appStyle.TextTest : appStyle.TextRed} href="/">Home</Nav.Link></Col>
        <Navbar.Toggle className={`${appStyle.ContrastBackground} ${appStyle.MainBorder}`} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className={isDarkMode ? appStyle.TextTest : appStyle.TextRed} id="basic-navbar-nav">
          <Nav className="me-auto">
            <Row>
              {user ? (signedIn) : (notSignedIn)}
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Container>
      </Navbar>
    </Container>
  )
}

export default NavBarComponent