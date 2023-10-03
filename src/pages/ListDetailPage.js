import axios from 'axios'
import { APIURL } from '../api/APIURL';
import React, { useEffect, useState } from 'react'
import style from '../styles/ListPage.module.css'
import { useParams } from "react-router-dom"
import appStyle from '../styles/App.module.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const ListDetailPage = () => {
    const { id } = useParams()
    const [list, setList] = useState({ results: []})
    const [items, setItems] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
        const getLists = async () => {
            console.log('Get list detail called')
            const [ {data: list}, {data: items}] = await Promise.all([
                axios.get(`${APIURL}/api/list/${id}`),
                axios.get(`${APIURL}/api/listitem/?list=${id}`)
            ])
            console.log(list, items)
            setList(list)
            setItems(items)
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
        {hasLoaded ? (
            <>
            <Row>
                <Col xs={2}>
                    <Link to={'/lists/'}><i class="fa-solid fa-arrow-left" />&nbsp; Lists</Link>
                </Col>
                <Col >
                    <h3>{list.title}</h3>
                </Col>
            </Row>
            {console.log(list, items)}
            {items.results.map((item, index) => (
                <>
                <Row key={index + 1 }>
                    <Col xs={2}>
                        <p>Delete</p>
                    </Col>
                    <Col >
                        <p>#{index + 1}:{item.content}</p>
                    </Col>
                </Row>
                </>
            ))}
            </>
        ) : (<h3>Loading...</h3>)}


    </Container>
  )
}

export default ListDetailPage