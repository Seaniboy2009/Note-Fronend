import React from 'react'
import appStyle from '../styles/App.module.css'
import style from '../styles/Home.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

import SignInForm from './SignInPage';

const HomePage = () => {

  return (
    <Container fluid className={`text-center ${appStyle.Container}`}>
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
        {<SignInForm />}
    </Container>
  )
}

export default HomePage