import React, { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosDefaults'
import { Col, Container, Row } from 'react-bootstrap'
import appStyle from '../styles/App.module.css'

const ListAllPage = () => {
    const urls = [
        '/api/notes/',
        '/api/lists/',
        '/api/movies/',
        '/api/listItems/',
    ]

    const [items, setItems] = useState({ results: [] })

    const handleGet = () => {
        // loop though the urls array and print each value
        for (let url of urls) {
            console.log(url)
            setItems((prevItems) => ({
                results: [...prevItems.results, url]
            }))
        }
        console.log(items)
    }

    useEffect(() => {
        setTimeout(() => {
            handleGet()
        }, 500);
    }, [])
  return (
    <Container className={`${appStyle.Container}`}>
        <Row>
            <Col><h2>List all</h2></Col>
        </Row>
        <Row>
            {urls.map(url => (
                <Col><p>url: {url}</p></Col>
            ))}
        </Row>
    </Container>
  )
}

export default ListAllPage