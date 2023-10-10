import React, { useState, useContext } from 'react'
import style from '../styles/Header.module.css'
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import AuthContext from '../contexts/AuthContext'

const Header = () => {

  let {user} = useContext(AuthContext)
  const [theme, setTheme] = useState(style.ThemeRed)

  const signedIn = (
    <>
      <Link className={style.Link} to={'/notes/'} refresh="true"><h4>Notes</h4></Link>
      <Link className={style.Link} to={'/lists/'}><h4>Lists</h4></Link>
      <h4>{user?.name}</h4>
    </>
  )

  return (
    <Container id='theme2' fluid className={`${style.Header} ${style.FixedTop} ${theme}`}>
      <Row className="justify-content-md-center">
        <Link className={style.Link} to={'/'}><h4>Home</h4></Link>
        {user ? (<>{signedIn}</>) : <><h4>Not logged in</h4></>}
      </Row>
    </Container>
  )
}

export default Header