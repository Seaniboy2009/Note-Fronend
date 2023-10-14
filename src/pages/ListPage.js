import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import style from '../styles/ListPage.module.css'
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../api/axiosDefaults';

import AuthContext from '../contexts/AuthContext'

const ListPage = () => {

    const [lists, setLists] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
    let {user} = useContext(AuthContext)

    useEffect(() => {
        const getMyLists = async () => {
            const {data} = await axiosInstance.get(`/api/lists/?owner=${user.user_id}`)
            console.log(data)
            setLists(data)
            setHasLoaded(true)
        }

        const getAllLists = async () => {
            const {data} = await axiosInstance.get(`/api/lists/`)
            setLists(data)
            setHasLoaded(true)
        }

        const timer = setTimeout(() => {
            getMyLists()
            // getAllLists()
        }, 1000)
        
        setHasLoaded(false)
    
        return () => {
            clearTimeout(timer)
        }

    }, [])


  return (
    <Container fluid className={appStyle.Container}>
        <Container>
            <Row>
                <Col md={1}>
                    <h3>Lists</h3>
                </Col>
                {hasLoaded ? (
                    <Col>
                        <Link to={'list/create'}>
                            <button className={appStyle.Button}>Create<i className="fa-sharp fa-solid fa-plus" /></button>
                        </Link>
                    </Col>
          ) : (<></>)}
            </Row>
        </Container>
        <Container>
            {hasLoaded ? (
                <>
                {lists?.results?.map((list, index) => (
                    <Link key={index} to={`list/${list.id}`}>
                        <Row className={style.List}>
                            <Col xs={3}>
                                <h5 className={style.ListDetails}># {list.id}</h5>
                            </Col>
                            <Col xs={7}>
                                <h5 className={style.ListDetails}>{list.title}</h5>
                            </Col>
                            <Col>
                                <i className='fa-solid fa-bars'/>
                            </Col>
                        </Row>
                    </Link>
                ))}
                </>
            ) : (
                <Row>
                    <Col>
                        <h3>Loading...</h3>
                    </Col>
                </Row>
            )}
        </Container>
    </Container>
  )
}

export default ListPage