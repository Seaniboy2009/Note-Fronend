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
  } = props

  let {user} = useContext(AuthContext)

  const [formData, setFormData] = useState({
    formTitle: title,
    formis_private: is_private,
    imageForm: '',
  })

  const { formTitle, formis_private } = formData

  const navigate = useNavigate()

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/notes/${id}`)
    navigate('/notes/')
  }

  const handleUpdate = (event) => {
    setFormData({...formData, formTitle: event.target.value})
  }

  const handleChecked = (event) => {
    setFormData({...formData, formis_private: event.target.checked})
    console.log(formData)
  }

  const handleSend = async () => {

    const formData  = new FormData()
    formData.append('title', formTitle)
    formData.append('is_private', formis_private)

    try {
      await axiosInstance.put(`/api/notes/${id}`, formData)
      window.location.reload()
    } catch (error) {
      
    }

  }

  const listPage = (
    <Col className={style.Text}>
      <p>Title: {title}</p>
      <p>Created: {created}</p>
      <p>Created By: {owner}</p>
      <p>updated: {updated}</p>
      <img src={image} className={style.ImageListPage} alt='note image'/>
      <br/>
    </Col>
  )

  const detailsPage = (
    <>
    <Row>
      <Col xs={5}>
        <Link to={'/notes/'}><i className="fa-solid fa-arrow-left" />&nbsp; Notes</Link>
      </Col>
    </Row>
    <Row>
      <Col>
        <p>Title: {title}</p>
        <p>Created: {created}</p>
        <p>Created By: {owner}</p>
        <p>updated: {updated}</p>
        <p>details: {details}</p>
        <p>private: {is_private ? 'private' : 'not private'}</p>
        <img src={image} className={style.ImageDetailPage} alt='note image'/>
      </Col>
    </Row>
    </>
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
              name='is_private'
              id="is_private"
              label="Set Private?"
              defaultChecked={is_private}
              defaultValue={is_private}
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
    <Container>
        {notePage ? (
          <>
            {owner == user.name ? (<>{isOwner}</>) : (<>{notOwner}</>)}
          </>
        ) : (
          <Container className={appStyle.Container}>
            <Link to={`note/${id}`} className={style.Link}>
              <Row>
                {listPage}
              </Row>
            </Link>
          </Container>
        )}
    </Container>
  )
}

export default NoteItem