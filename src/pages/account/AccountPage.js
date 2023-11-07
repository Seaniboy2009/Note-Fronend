import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { Col, Container, Row } from 'react-bootstrap'
import appStyle from '../../styles/App.module.css'
import { useTheme } from '../../utils/ThemeSelection';


const AccountPage = () => {

  let {user, expire} = useContext(AuthContext)
  const {isDarkMode, toggleDarkMode} = useTheme()

  return (
    <Container>
      <Row className={isDarkMode ? appStyle.BackgroundTestContrast : appStyle.BackgroundRedContrast}>
        <Col>
          <h2>Account Page</h2>
          <h3>Name: {user.name}</h3>
          <h3>Login expires: {expire}</h3>
          {console.log(user)}
          {console.log(expire)}
        </Col>
      </Row>
      <Row className={isDarkMode ? appStyle.BackgroundTestContrast : appStyle.BackgroundRedContrast}>
        <Col xl={12}>
          <h4>Theme</h4>
        </Col>
        <Col>
          <p>Light</p>
        </Col>
        <Col>
          <input className={isDarkMode ? appStyle.TextTest : appStyle.TextRed} type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
        </Col>
      </Row>
    </Container>
  )
}

export default AccountPage