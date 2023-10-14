import React from 'react'
import style from '../styles/Header.module.css'
import Container from 'react-bootstrap/Container';
import NavBarComponent from './NavBarComponent';

const Header = () => {

  return (
    <Container fluid="xl" className={`${style.Header} ${style.FixedTop}`}>
      {<NavBarComponent />}
    </Container>
  )
}

export default Header