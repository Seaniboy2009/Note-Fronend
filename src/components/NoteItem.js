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
    toggle,
  } = props

  let {user} = useContext(AuthContext)

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
    console.log(formData)
  }

  const handleChecked = (event) => {
    setFormData({...formData, [event.target.name]: event.target.checked})
    console.log(formData)
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
      console.log(formData)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }

  }

  const listPage = (
    <Col className={style.Text}>
      {is_private ? <i className={`fa-solid fa-lock ${style.Private}`}></i> : null}
      {toggle ? <i className={`fa-solid fa-eye ${style.Watched}`}></i> : null}
      <p>Title: {title}</p>
      {/* <Row>
          <Col className={style.NoteDetails}><p>Title: {title}</p></Col>
      </Row>
      <Row>
          <Col className={style.NoteDetails}>
          <img src={image} className={style.ImageListPage} alt='note image'/>
          </Col>
      </Row> */}
      <img src={image} className={style.ImageListPage} alt='note image'/>
      <br/>
    </Col>
  )

  const detailsPage = (
    <Container>
      <Row className={`text-left ${appStyle.Container}`}>
        <Col>
          <Link to={'/notes/'}><i className="fa-solid fa-arrow-left" />&nbsp;</Link>
        </Col>
      </Row>
      {/* <Row className={`text-left ${appStyle.Container}`}>
        <Col className={style.TextDetail}>
          <p>Title: {title}</p>
          <p>Created: {created}</p>
          <p>Updated: {updated}</p>
          <p>Details: {details}</p>
        </Col>
      </Row> */}
      <Row className={`text-left ${appStyle.Container}`}>
          <Col md={3} className={style.NoteDetails}><p>Title: {title}</p></Col>
          <Col md={3} className={style.NoteDetails}><p>Created: {created}</p></Col>
          <Col md={3} className={style.NoteDetails}><p>Updated: {updated}</p></Col>
          <Col md={3} className={style.NoteDetails}><p>Details: {details}</p></Col>
          <Col md={3} className={style.NoteDetails}><p>Private: {is_private ? 'Yes' : 'No'}</p></Col>
          <Col md={3} className={style.NoteDetails}><p>Watched: {toggle ? 'Yes' : 'No'}</p></Col>
      </Row>
      <Row>
        <Col>
          <img src={image} className={style.ImageDetailPage} alt='note image'/>
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
    <Container fluid className={`text-center ${appStyle.Container}`}>
        {notePage ? (
          <>
            {owner === user.name ? (<>{isOwner}</>) : (<>{notOwner}</>)}
          </>
        ) : (
          <Container fluid className={`text-center ${appStyle.Container}`}>
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