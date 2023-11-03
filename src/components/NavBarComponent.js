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

const NavBarComponent = () => {

  const location = useLocation()
  const [loc, setLoc] = useState()

  let {user} = useContext(AuthContext)

  useEffect(() => {
    setLoc(location.pathname)
    console.log(location)
  }, [location])
  
  const signedIn = (
    <Row xs={12}>
      <Col><Nav.Link className={`${style.NavBarItem} ${(loc == '/notes/' ? style.Active : null)}`} href="/notes/">Notes</Nav.Link></Col>
      <Col><Nav.Link className={`${appStyle.MainText} ${(loc == '/lists/' ? style.Active : null)}`} href="/lists/">Lists</Nav.Link></Col>
      <Col>
        <Nav.Link className={`${appStyle.MainText} ${(loc == '/test/' ? style.Active : null)}`} href="/test/">test</Nav.Link>
      </Col>
      <Col>
        <Nav.Link className={`${appStyle.MainText} ${(loc == '/account/' ? style.Active : null)}`} href="/account/">{user?.name}</Nav.Link>
      </Col>
    </Row>
  )
  
  const notSignedIn = (
    <>
      <Nav.Link className={appStyle.MainText} href="/">Sign in</Nav.Link>
      <Nav.Link className={appStyle.MainText} href="/register/">Sign up</Nav.Link>
    </>
  )

  return (
    <Container fluid="xl" className={`${style.Header} ${style.FixedTop}`}>
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Col><Nav.Link className={appStyle.MainText} href="/">Home</Nav.Link></Col>
        <Navbar.Toggle className={`${appStyle.ContrastBackground} ${appStyle.MainBorder}`} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className={appStyle.MainText} id="basic-navbar-nav">
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