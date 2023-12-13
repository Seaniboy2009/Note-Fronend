import React, { useState } from 'react'
import {axiosInstance} from '../api/axiosDefaults'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import appStyle from '../styles/App.module.css'
import { useTheme } from '../utils/ThemeSelection';

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        username: '',
        password1: '',
        password2: '',
    })

    const { username, password1, password2 } = formData
    const [errors, setErrors] = useState({})
    const {isDarkMode} = useTheme()

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
        console.log(formData)
        console.log({username, password1, password2})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData  = new FormData()
        formData.append('username', username)
        formData.append('password1', password1)
        formData.append('password2', password2)

        try {
            await axiosInstance.post('/dj-rest-auth/registration/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        } catch (error) {
            console.log(error.response.request.responseText)
            setErrors(error?.response.data)
        }

    }


  return (
    <Container className={`${isDarkMode ? appStyle.BackgroundContainerTest : appStyle.BackgroundContainerSmallRed}`}>
        <form onSubmit={handleSubmit}>
        <Row>
            <Col>
                <h5>Please complete the below to create an account.</h5>
            </Col>
        </Row>
        <Row><Col>{errors?.username?.map((error, index) => (<p key={index}>{error}</p>))}</Col></Row>
        <br/>
        <Row>
            <Col>
                <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type='text' name='username' onChange={handleChange} placeholder="Enter Username (Case sensitive)" />
            </Col>
        </Row>
        <Row><Col>{errors?.password1?.map((error, index) => (<p key={index}>{error}</p>))}</Col></Row>
        <br/>
        <Row>
            <Col>
                <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type='password' name='password1' onChange={handleChange} placeholder="Enter Password" />
            </Col>
        </Row>
        <Row><Col>{errors?.password2?.map((error, index) => (<p key={index}>{error}</p>))}</Col></Row>
        <br/>
        <Row>
            <Col>
                <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type='password' name='password2' onChange={handleChange} placeholder="Confirm Password" />
            </Col>
        </Row>
        <br/>
        <Row>
            <Col>
                <input className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`} type="submit"/>
            </Col>
        </Row>
        </form>
    </Container>
  )
}

export default RegisterPage