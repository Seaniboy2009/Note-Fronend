import React, { useContext, useEffect, useState, useRef  } from 'react'
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
  const navbarRef = useRef(null)

  let {user} = useContext(AuthContext)
  const {isDarkMode, toggleDarkMode} = useTheme()
  const [navbarOpen, setNavbarOpen] = useState(false)

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen)
    console.log(navbarOpen)
  }

  const closeNavbar = () => {
    setNavbarOpen(false);
  }

  useEffect(() => {
    setLoc(location.pathname)
    console.log('NavbarOpen state:', navbarOpen);
    const handleDocumentClick  = (event) => {
      if (navbarRef.current && navbarOpen && !navbarRef.current.contains(event.target)) {
        closeNavbar();
      }
    }

    const delayedDocumentClickSetup = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
    }, 0)

    return () => {
      clearTimeout(delayedDocumentClickSetup);
      document.removeEventListener('click', handleDocumentClick);
    }

  }, [location, navbarOpen])

  // show the buttons and links for sign in user
  const signedIn = (
    <Row>
      <Col>
        <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/account/' ? style.Active : null)}`} href="/account/">Account</Nav.Link>
      </Col>
    </Row>
  )
  
  // Show the buttons and links for none signed in user
  const notSignedIn = (
    <Row>
      <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/' ? style.Active : null)}`}  href="/">Sign in</Nav.Link>
      <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/register/' ? style.Active : null)}`}  href="/register/">Sign up</Nav.Link>
    </Row>
  )

  return (
    <Container>
      {user ? (
          <p>User</p>
          ) : <p>No User</p>
      }
      <Row
        className={
          `
          ${style.Header}
          ${style.FixedTop}
          ${isDarkMode ? appStyle.HeaderThemeTest : appStyle.HeaderThemeRed}
          `
        }>
        <Col xs={3}><button className={`${appStyle.ButtonNavBar} ${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonNavBar}`} onClick={toggleNavbar}><i class="fa-solid fa-ellipsis-vertical"></i></button></Col>
        {user ? (
            <>
            <Col xs={3}>
              <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/notes/' ? style.Active : null)}`} href="/notes/"><i className="fa-solid fa-clipboard"></i><p>Notes</p></Nav.Link>
            </Col>
            <Col xs={3}>
              <Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/lists/' ? style.Active : null)}`} href="/lists/"><i className="fa-regular fa-rectangle-list"></i><p>List</p></Nav.Link>
            </Col>
            </>
          ) : null
        }
      </Row>
      <Container ref={navbarRef} className={`${style.NavbarPopout} ${navbarOpen ? style.open : ''} ${isDarkMode ? appStyle.HeaderThemeTest : appStyle.HeaderThemeRed}`}>
        <Row >
          <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed}`} href="/">*********IMAGE******</Nav.Link></Col>
        </Row>
        <Row >
          <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/' ? style.Active : null)}`} href="/"><i className="fa-solid fa-house"></i> Home</Nav.Link></Col>
        </Row>
        <Row >
          <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/account/' ? style.Active : null)}`} href="/account/"><i className="fa-solid fa-user"></i> Account</Nav.Link></Col>
        </Row>
        <Row >
          <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/notes/' ? style.Active : null)}`} href="/notes/"><i className="fa-solid fa-gear"></i> Notes</Nav.Link></Col>
        </Row>
        <Row >
          <Col><Nav.Link className={`${isDarkMode ? appStyle.TextTest : appStyle.TextRed} ${(loc == '/settings/' ? style.Active : null)}`} href="/"><i className="fa-solid fa-gear"></i> Settings</Nav.Link></Col>
        </Row>
      </Container>
      <Row className={`${style.NavbarPopout} ${navbarOpen ? style.back : ''} ${appStyle.HeaderThemeTest}`}>
      </Row>
    </Container>
  )
}

export default NavBarComponent