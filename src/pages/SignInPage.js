import React, { useContext } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyle from '../styles/App.module.css'
import AuthContext from '../contexts/AuthContext'
import { useTheme } from '../utils/ThemeSelection';

const SignInForm = () => {

    let {handleLogIn} = useContext(AuthContext)
    let {handleLogOut} = useContext(AuthContext)
    let {handleChange} = useContext(AuthContext)
    let {user, signInErrors} = useContext(AuthContext)
    const {isDarkMode, toggleDarkMode} = useTheme()
    
    return (
        <Container className={`text-center`}>
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
                        <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type="text" name="username" placeholder="Enter Username" onChange={handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type="password" name="password" placeholder="Enter Password" onChange={handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type="submit"/>
                    </Col>
                </Row>
                </form>
            ) : (
                <Row>
                    <Col>
                        <button className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} onClick={handleLogOut}>Log out</button>
                    </Col>
                </Row>
            )}
        </Container>
    )
}

export default SignInForm