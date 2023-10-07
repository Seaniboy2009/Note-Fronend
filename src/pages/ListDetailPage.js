import axios from 'axios'
import { APIURL } from '../api/APIURL';
import React, { useEffect, useState } from 'react'
import style from '../styles/ListDetailPage.module.css'
import { useParams, useNavigate } from "react-router-dom"
import appStyle from '../styles/App.module.css'
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';

const ListDetailPage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [list, setList] = useState({ results: []})
    const [items, setItems] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)

    const [formData, setFormData] = useState({
        list: '',
        content: '',
    });

    const { content } = formData;

    const handleDelete = async (itemToDelete) => {
        try {
            await axios.delete(`${APIURL}/api/listitem/${itemToDelete}`)
            const newItems = items.results.filter(item => item.id !== itemToDelete)
            setItems(newItems)
        } catch (error) {
            
        }
    }

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

    }, [setItems])

    const createItem = async () => {
        const formData  = new FormData()
  
        formData.append('content', content)
        formData.append('list', list.id)

        console.log(formData)
  
        try {
        await axios.post(`${APIURL}/api/listitem/`, formData)
        navigate('/')
        } catch (error) {
          console.log(error)
        }
    }

    const handleChange = (event) => {
        setFormData({...formData, content: event.target.value})
    }

  return (
    <Container fluid className={appStyle.Container}>
        <Container>
        {hasLoaded ? (
            <>
            <Row>
                <Col md={2}>
                    <Link to={'/lists/'}><i className="fa-solid fa-arrow-left" />&nbsp; Lists</Link>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h3>{list.title}</h3>
                </Col>
            </Row>
            {items?.results?.map((item, index) => (
                <Row key={index + 1} className={style.ListContainer}>
                    <Col xs={2}>
                        <button onClick={() => handleDelete(item.id)} className={appStyle.Button}>Delete</button>
                    </Col>
                    <Col >
                        <p>#{index + 1}:{item.content}</p>
                    </Col>
                </Row>
            ))}
            </>
        ) : (<h3 key='loading'>Loading...</h3>)}
            <Row>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle className={appStyle.Button} id="dropdown-basic">
                            New
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={style.Dropdown}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="content"><h4>Title</h4></Form.Label>
                                <Form.Control
                                    type="text"
                                    id="content"
                                    aria-describedby="content"
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Col>
                                <button onClick={createItem} className={appStyle.Button}>Add item</button>
                            </Col>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
        </Container>
    </Container>
  )
}

export default ListDetailPage