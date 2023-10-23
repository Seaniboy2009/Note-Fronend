import React, { useContext, useEffect, useState } from 'react'
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'
import axiosInstance from '../api/axiosDefaults';

import SignInForm from './SignInPage';
import TestPage from './TestPage';
import Loader from '../components/Loader';

const HomePage = () => {
    let {user} = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const loadApp = async () => {
            try {
              const data = await axiosInstance.get(`/`)
              const status = data.status
              console.log(status)
              if (status === 200) {
                console.log(`${status} OK`)
                setLoaded(true)
              } else if (status === 404) {
                console.log(`${status} not found`)
              } else if (status === 500) {
                console.log(`${status} server error`)
              }
            } catch (error) {
                console.log(error)
            }
        }

        const timer = setTimeout(() => {
            loadApp()
        }, 1000)
        
        const load = setInterval(() => {
            if (loaded === false) {
                console.log('App not loaded')
                loadApp()
            } else {
                console.log('App loaded')
            }
            
        }, 5000);
        
        return () => {
            clearTimeout(timer)
            clearInterval(load)
          }
    }, [])

  return (
    <Container fluid className={`text-center ${appStyle.Container}`}>
        {loaded ? (
            <>
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
                ) : (null)}
                {<SignInForm />}
                {<TestPage />}
            </>
        ) : (<Loader spinner text='Loading App, Please wait' />)}
    </Container>
  )
}

export default HomePage