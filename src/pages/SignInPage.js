import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyle from '../styles/App.module.css'
import AuthContext from '../contexts/AuthContext'
import style from '../styles/SignInPage.module.css'

const SignInForm = () => {

    let {handleLogIn} = useContext(AuthContext)
    let {handleLogOut} = useContext(AuthContext)
    let {handleChange} = useContext(AuthContext)
    let {user, signInErrors} = useContext(AuthContext)
    
    return (
        <Container className={`text-center ${appStyle.Container}`}>
            {!user ? (
                <form onSubmit={handleLogIn}>
                <Row>
                    <Col>
                        <h3>Please sign in to access the app.</h3>
                    </Col>
                </Row>
                <Row><Col>{signInErrors != null ? (<p>{signInErrors}</p>) : null}</Col></Row>
                <Row>
                    <Col>
                        <input className={`${style.Form} ${appStyle.ButtonLarge}`} type="text" name="username" placeholder="Enter Username" onChange={handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className={`${style.Form} ${appStyle.ButtonLarge}`} type="password" name="password" placeholder="Enter Password" onChange={handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className={`${appStyle.Button} ${appStyle.ButtonLarge}`} type="submit"/>
                    </Col>
                </Row>
                </form>
            ) : (
                <Row>
                    <Col>
                        <button className={`${appStyle.Button} ${appStyle.ButtonLarge}`} onClick={handleLogOut}>Log out</button>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default SignInForm