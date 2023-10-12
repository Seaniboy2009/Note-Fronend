import React, { useState, useContext } from 'react'
import style from '../styles/Header.module.css'
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthContext from '../contexts/AuthContext'

const Header = () => {

  let {user} = useContext(AuthContext)
  const [theme, setTheme] = useState(style.ThemeRed)

  const signedIn = (
    <>
      <Col xs={3}>
        <Link to={'/notes/'} refresh="true"><h4 className={style.Link}>Notes</h4></Link>
      </Col >
      <Col xs={3}>
        <Link to={'/lists/'}><h4 className={style.Link}>Lists</h4></Link>
      </Col>
      <Col xs={3}>
        <h5 className={style.Link}>User: {user?.name}</h5>
      </Col>
    </>
  )

  return (
    <Container fluid className={`${style.Header} ${style.FixedTop} ${theme} `}>
      <Row xs={12}>
        <Col xs={3}>
          <Link to={'/'}><h4 className={style.Link}>Home</h4></Link>
        </Col>
        {user ? (<>{signedIn}</>) : <><h4 className={style.Link}>Not logged in</h4></>}
      </Row>
    </Container>
  )
}

export default Header