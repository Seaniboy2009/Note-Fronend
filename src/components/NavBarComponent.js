import React, { useContext } from 'react'
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import AuthContext from '../contexts/AuthContext'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import appStyle from '../styles/App.module.css'

const NavBarComponent = () => {

    let {user} = useContext(AuthContext)
  
    const signedIn = (
      <Row xs={12}>
      <Col md="auto"><Nav.Link className={appStyle.MainText} href="/notes/">Notes</Nav.Link></Col>
      <Col md="auto"><Nav.Link className={appStyle.MainText} href="/lists/">Lists</Nav.Link></Col>
      <Col md="auto">
        <Nav.Link className={appStyle.MainText} href="/">{user?.name}</Nav.Link>
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
  )
}

export default NavBarComponent