import React, { useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import appStyle from '../../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../../api/axiosDefaults';
import TestPage from '../TestPage';

const NoteCreate = () => {
  
  const navigate = useNavigate()
  const imageInput = useRef(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    is_private: false,
  })

  const { title, is_private } = formData
  const [submit, setSubmit] = useState(false)
  const [search, setQueryGlobal] = useState('');

  const createNote = async () => {
      const formData  = new FormData()

      formData.append('title', title)
      formData.append('is_private', is_private)
      formData.append('image', imageInput.current.files[0])

      try {
        setSubmit(true)
        await axiosInstance.post("/api/notes/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
          },
        });
        setSubmit(false)
        navigate('/notes/')
      } catch (error) {
        console.log(error)
      }
  }

  const handleChange = (event) => {
      setFormData({...formData, [event.target.name]: event.target.value})
      if (event.target.name == title) {
        setQueryGlobal(event.target.value)
      }
      console.log(formData)
  }

  const handleChecked = (event) => {
    setFormData({...formData, is_private: event.target.checked})
    console.log(formData)
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
      <Row>
        <Col>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="title"><h4>Title</h4></Form.Label>
          <Form.Control
              type="text"
              name='title'
              id="title"
              aria-describedby="title"
              onChange={handleChange}
          />
          <Form.Label htmlFor="image"><h4>Image</h4></Form.Label>
          <Form.Control
              type="file"
              name='image'
              id='image'
              onChange={handleChangeImage}
              ref={imageInput}
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
          <button onClick={createNote} className={appStyle.Button}>Create</button>
        </Col>
      </Row>
      <Row>
        <Col md={1}>
          <Link to={'/'} className={appStyle.ButtonLink}>Back</Link>
        </Col>
      </Row>
      <Row>
        <TestPage search={title} searchPage />
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