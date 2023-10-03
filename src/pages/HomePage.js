import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container className='text-center'>
        <Row>
            <Col><h3>Home</h3></Col>
        </Row>
        <Row>
            <Col>
                <Link to={'notes/'}>
                <button>Notes</button>
                </Link>
            </Col>
            <Col>
                <Link to={'lists/'}>
                <button>Lists</button>
                </Link>
            </Col>
        </Row>
    </Container>
  )
}

export default HomePage