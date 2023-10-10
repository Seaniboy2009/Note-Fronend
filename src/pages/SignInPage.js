import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyle from '../styles/App.module.css'
import AuthContext from '../contexts/AuthContext'

const SignInForm = () => {

    let {handleLogIn} = useContext(AuthContext)
    let {handleLogOut} = useContext(AuthContext)
    let {handleChange} = useContext(AuthContext)
    
    return (
        <Container fluid className={`text-center ${appStyle.Container}`}>
            <Row>
                <Col>
                <form onSubmit={handleLogIn}>
                    <input type="text" name="username" placeholder="Enter Username" onChange={handleChange}/>
                    <input type="password" name="password" placeholder="Enter Password" onChange={handleChange}/>
                    <input type="submit"/>
                </form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <button onClick={handleLogOut}>Log out</button>
                </Col>
            </Row>
        </Container>
    )
}

export default SignInForm