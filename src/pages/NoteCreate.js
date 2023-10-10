import React, { useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../api/axiosDefaults';

const NoteCreate = () => {
  
  const navigate = useNavigate()
  const imageInput = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });

  const { title } = formData;
  const [submit, setSubmit] = useState(false)

  const createNote = async () => {
      const formData  = new FormData()

      formData.append('title', title)
      formData.append('image', imageInput.current.files[0])

      try {
        setSubmit(true)
        const response = await axiosInstance.post("/api/notes/", formData, {
          headers: {
            // Authorization: localStorage.getItem('access_token')
            //   ? "Bearer " + localStorage.getItem('access_token')
            //   : null,
            'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
          },
        });
        setSubmit(false)
        navigate('/notes/')
      } catch (error) {
        console.log(error)
      }
  }

  const updateNote = (event) => {
      setFormData({...formData, title: event.target.value})
  }

  const handleChangeImage = (event) => {
      setFormData({
          ...formData,
          image: URL.createObjectURL(event.target.files[0]),
  })}

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
              onChange={updateNote}
          />
          <Form.Label htmlFor="image"><h4>Image</h4></Form.Label>
          <Form.Control
              type="file"
              id='image'
              onChange={handleChangeImage}
              ref={imageInput}
          />
          </Form.Group>
        </Col>
      </Row>
      <Row fluid>
        <Col md={1}>
          <button onClick={createNote} className={appStyle.Button}>Create</button>
        </Col>
      </Row>
      <Row fluid>
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

export default NoteCreate