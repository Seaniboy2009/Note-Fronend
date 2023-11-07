import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from '../styles/NoteItem.module.css'
import appStyle from '../styles/App.module.css'
import axiosInstance from '../api/axiosDefaults';
import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AuthContext from '../contexts/AuthContext'
import { useTheme } from '../utils/ThemeSelection';

const NoteItem = ( props ) => {
  const {
    id,
    title,
    owner,
    created,
    updated,
    image,
    details,
    notePage,
    is_private,
    toggle,
  } = props

  let {user} = useContext(AuthContext)
  const {isDarkMode} = useTheme()

  const [formData, setFormData] = useState({
    newTitle: title,
    newIs_private: is_private,
    newToggle: toggle,
    image: image,
  })
  const { newTitle, newIs_private, newToggle } = formData

  const navigate = useNavigate()

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/notes/${id}`)
    navigate('/notes/')
  }

  const handleUpdate = (event) => {
    setFormData({...formData, newTitle: event.target.value})
    console.log('Form data updating:', formData)
  }

  const handleChecked = (event) => {
    setFormData({...formData, [event.target.name]: event.target.checked})
    console.log('Form data updating:', formData)
  }

  const handleSend = async () => {

    const formData  = new FormData()
    formData.append('title', newTitle)
    formData.append('is_private', newIs_private)
    formData.append('toggle', newToggle)

    try {
      await axiosInstance.put(`/api/notes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
        },
      })
      console.log('Form data sent:', formData)
      window.location.reload()
    } catch (error) {
      console.log('Error:', error)
    }

  }

  const detailsPage = (
    <Container>
      <Row className={`text-left`}>
        <Col>
          <Link to={'/notes/'}><i className="fa-solid fa-arrow-left" />&nbsp;</Link>
        </Col>
      </Row>
      <Row className={isDarkMode ? appStyle.NoteDetailsTest : appStyle.NoteDetailsRed}>
          <Col md={3}><p>Title: {title}</p></Col>
          <Col md={3}><p>Created: {created}</p></Col>
          <Col md={3}><p>Updated: {updated}</p></Col>
          <Col md={3}><p>Details: {details}</p></Col>
          <Col md={3}><p>Private: {is_private ? 'Yes' : 'No'}</p></Col>
          <Col md={3}><p>Watched: {toggle ? 'Yes' : 'No'}</p></Col>
      </Row>
      <Row>
        <Col>
          <img src={image} className={style.Image} alt='note image'/>
        </Col>
      </Row>
    </Container>
  )

  const isOwner = (
    <>
      {detailsPage}
      <Row className={style.ButtonContainer}> 
        <Col>
          <button className={appStyle.Button} onClick={handleDelete}>Delete</button>
          <button className={appStyle.Button} onClick={handleSend}>Edit</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="title"><h4>{title}</h4></Form.Label>
            <Form.Control
              type="text"
              id="title"
              defaultValue={title}
              aria-describedby="title"
              onChange={handleUpdate}
            />
            <br/>
            <Form.Check
              type="checkbox"
              name='newIs_private'
              id="newIs_private"
              label="Set Private?"
              defaultChecked={is_private}
              defaultValue={true}
              onChange={handleChecked}
            />
            <Form.Check
              type="checkbox"
              name='newToggle'
              id="newToggle"
              label="Set toggle?"
              defaultChecked={toggle}
              defaultValue={false}
              onChange={handleChecked}
            />
            </Form.Group>
        </Col>
      </Row>
    </>
  )

  const notOwner = (
    <>
      {detailsPage}
    </>
  )

  return (
    <Container className={`text-center`}>
        {notePage ? (
          <>
            {owner === user.name ? (<>{isOwner}</>) : (<>{notOwner}</>)}
          </>
        ) : (
          <Link to={`note/${id}`} className={style.Link}>
            <Row className={isDarkMode ? style.NoteTest : style.NoteRed}>
              <Col xs={5}><img src={image} className={style.Image} alt='note image'/></Col>
              <Col xs={5}>{title}</Col>
              <Col xs={2}>
              {is_private ? <i className={`fa-solid fa-lock ${style.Private}`}></i> : null}
              {toggle ? <i className={`fa-solid fa-eye ${style.Watched}`}></i> : null}
              </Col>
            </Row>
          </Link>
        )}
    </Container>
  )
}

export default NoteItem