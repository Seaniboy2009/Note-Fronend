import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { APIURL } from '../api/APIURL';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import appStyle from '../styles/App.module.css'
import axiosInstance from '../api/axiosDefaults';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListCreate = () => {
  
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
      title: '',
    });

    const { title } = formData;
    const [submit, setSubmit] = useState(false)

    const createList = async () => {
      
      const formData  = new FormData()
      formData.append('title', title)
  
      try {
        setSubmit(true)
        const response = await axiosInstance.post("/api/lists/", formData, {
          headers: {
            // Authorization: localStorage.getItem('access_token')
            //   ? "Bearer " + localStorage.getItem('access_token')
            //   : null,
            'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
          },
        });
        setSubmit(false)
        navigate('/lists/')
      } catch (error) {
        console.log(error)
      }
    }

    const updateList = (event) => {
        setFormData({...formData, title: event.target.value})
    }
  

    const submittingText = (
      <Container>
        <Row>
          <Col>
            <h4>Please wait..Submitting</h4>
          </Col>
        </Row>
      </Container>
    )
  
    const defaultText = (
      <Container>
        <Row fluid>
          <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title"><h4>Title</h4></Form.Label>
            <Form.Control
                type="text"
                id="title"
                aria-describedby="title"
                onChange={updateList}
            />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <button onClick={createList} className={appStyle.Button}>Create</button>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <Link to={'/'} className={appStyle.ButtonLink}>Back</Link>
          </Col>
        </Row>
      </Container>
    )
  return (
    <Container fluid className={appStyle.Container}>
      {submit ? ((submittingText)) : ((defaultText))}
    </Container>
  )
}

export default ListCreate