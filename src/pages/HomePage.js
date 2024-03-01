import React, { useContext, useEffect, useState } from 'react'
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext'
import {axiosInstance} from '../api/axiosDefaults';

import SignInForm from './SignInPage';
import Loader from '../components/Loader';
import { useTheme } from '../utils/ThemeSelection';

const HomePage = () => {
    let {user} = useContext(AuthContext)
    const [loaded, setLoaded] = useState(false)

    const {isDarkMode} = useTheme()

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
    <Container className={`${isDarkMode ? appStyle.BackgroundContainerTest : appStyle.BackgroundContainerSmallRed}`}>
        {loaded ? (
            <Container>
              {user ? (
              <>
                <Row auto>
                  <Col><h4>Welcome {user.name}</h4></Col>
                </Row>
                <Row>
                  <Col>
                    <Link to={'notes/'}>
                      <button className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`}>Notes</button>
                    </Link>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Link to={'lists/'}>
                      <button className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`}>Lists</button>
                    </Link>
                  </Col>
                </Row>
              </>
                  ) : (null)}
                  {<SignInForm />}
            </Container>
        ) : (<Loader spinner text='Loading App, Please wait' />)}
    </Container>
  )
}

export default HomePage