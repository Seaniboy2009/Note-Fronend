import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { APIURL } from '../api/APIURL';
import { useNavigate } from "react-router-dom"

import style from '../styles/ListPage.module.css'
import appStyle from '../styles/App.module.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListPage = () => {
    const navigate = useNavigate()

    const [lists, setLists] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        const getLists = async () => {
            const {data} = await axios.get(`${APIURL}/api/list/`)
            setLists(data)
            setHasLoaded(true)
        }

        const timer = setTimeout(() => {
            getLists()
        }, 1000)
        
        setHasLoaded(false)
    
        return () => {
            clearTimeout(timer)
        }

    }, [])


  return (
    <Container fluid className={appStyle.Container}>
        <Container>
            <Row fluid>
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
                {lists?.results.map((list, index) => (
                    <Link to={`list/${list.id}`}>
                        <Row key={index} className={style.List}>
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