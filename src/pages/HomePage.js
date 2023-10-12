import React, { useContext } from 'react'
import appStyle from '../styles/App.module.css'
import style from '../styles/Home.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'

import SignInForm from './SignInPage';
import TestPage from './TestPage';

const HomePage = () => {
    let {user} = useContext(AuthContext)

  return (
    <Container fluid className={`text-center ${appStyle.Container}`}>

        {user ? (
            <>
            <Row>
            <Col><h3>Home</h3></Col>
            </Row>
            <Row>
            <Col>
                <Link to={'notes/'}>
                <button className={`${appStyle.Button} ${appStyle.ButtonLarge}`}>Notes</button>
                </Link>
            </Col>
            </Row>
            <Row>
            <Col>
                <Link to={'lists/'}>
                <button className={`${appStyle.Button} ${appStyle.ButtonLarge}`}>Lists</button>
                </Link>
            </Col>
            </Row>
            </>
        ) : (
            <></>
        )}
        {<SignInForm />}
        {<TestPage />}
    </Container>
  )
}

export default HomePage