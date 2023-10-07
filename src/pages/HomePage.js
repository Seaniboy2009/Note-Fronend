import React, { useState } from 'react'
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosDefaults';
import jwt_decode from "jwt-decode";

const HomePage = () => {
    const testFormData = Object.freeze({
        username: 'admin',
        password: 'Kyle&Ewan89'
    })

    const [formData, setFormData] = useState(testFormData)
    const [user, setUser] = useState('')

    const getTokens = () => {
        axiosInstance.post('api/token/', {
            username: formData.username,
            password: formData.password,
        }).then((res) => {
            localStorage.setItem('access_token', res.data.access)
            localStorage.setItem('refresh_token', res.data.refresh)
            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token')
            const data = jwt_decode(res.data.access)

            console.log(data)
            console.log(data.name)
            console.log(res.data)
            console.log(user)
            setUser(data.name.toString())
        })

    }

    const refreshTokens = () => {
        axiosInstance.post('api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token')
        }).then((res) => {
            localStorage.setItem('access_token', res.data.access)
            // localStorage.setItem('refresh_token', res.data.refresh)
            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token')

            console.log(res.data)
        })

    }

  return (
    <Container fluid className={`text-center ${appStyle.Container}`}>
        <Row>
            <Col><h3>Home</h3></Col>
        </Row>
        <Row>
            <Col>
                <Link to={'notes/'}>
                <button className={appStyle.Button}>Notes</button>
                </Link>
            </Col>
            <Col>
                <Link to={'lists/'}>
                <button className={appStyle.Button}>Lists</button>
                </Link>
            </Col>
        </Row>
        <Container fluid className={`text-center ${appStyle.Container}`}>
        <Row>
            <Col><h3>Test connection</h3></Col>
            {user ? (<p>{user}</p>) : ('Sign in')}
        </Row>
        <Row>
            <Col>
                <button onClick={getTokens} className={appStyle.Button}>Get tokens</button>
            </Col>
            <Col>
                <button onClick={refreshTokens} className={appStyle.Button}>Refresh tokens</button>
            </Col>
        </Row>
    </Container>
    </Container>

  )
}

export default HomePage