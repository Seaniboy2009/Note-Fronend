import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import appStyle from '../../styles/App.module.css'
import axiosInstance from '../../api/axiosDefaults';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ListCreate = () => {
  
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
      title: '',
      is_private: false,
    });

    const { title, is_private } = formData;
    const [submit, setSubmit] = useState(false)

    const createList = async () => {
      
      const formData  = new FormData()
      formData.append('title', title)
      formData.append('is_private', is_private)
  
      try {
        setSubmit(true)
        await axiosInstance.post("/api/lists/", formData,)
        setSubmit(false)
        navigate('/lists/')
      } catch (error) {
        console.log(error)
      }
    }

    const handleChecked = (event) => {
      setFormData({...formData, is_private: event.target.checked})
      console.log(formData)
    }

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
        console.log(formData)
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
        <Row>
          <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title"><h4>Title</h4></Form.Label>
            <Form.Control
              type="text"
              id="title"
              name='title'
              aria-describedby="title"
              onChange={handleChange}
            />
            <br/>
            <Form.Check
              type="checkbox"
              name='is_private'
              id="is_private"
              label="Set Private?"
              onChange={handleChecked}
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
            <Link to={'/lists/'} className={appStyle.ButtonLink}>Back</Link>
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