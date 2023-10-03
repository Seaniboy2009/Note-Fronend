import axios from 'axios'
import { APIURL } from '../api/APIURL';
import React, { useEffect, useState } from 'react'
import style from '../styles/ListPage.module.css'
import appStyle from '../styles/App.module.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const ListPage = () => {
    const [lists, setLists] = useState({ results: []})

    useEffect(() => {
        const getLists = async () => {
            console.log('Get list called')
            const {data} = await axios.get(`${APIURL}/api/list/`)
            console.log(data)
            setLists(data)
        }

        const timer = setTimeout(() => {
            getLists()
          }, 1000)
    

          return () => {
            clearTimeout(timer)
          }

    }, [])


  return (
    <Container fluid className={appStyle.Container}>
        <Container>
            <Row fluid>
                <Col>
                    <h3>Lists</h3>
                </Col>
            </Row>
        </Container>
        <Container>
                {lists ? (
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
            ) : ('No lists')}
        </Container>
    </Container>
  )
}

export default ListPage