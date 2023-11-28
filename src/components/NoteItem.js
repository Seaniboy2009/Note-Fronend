import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from '../styles/NoteItem.module.css'
import appStyle from '../styles/App.module.css'
import axiosInstance from '../api/axiosDefaults';
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
    image_url,
    details,
    detailPage,
    is_private,
    toggle,
  } = props

  let {user} = useContext(AuthContext)
  const {isDarkMode} = useTheme()
  const [edit, setEdit] = useState(false)

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

  const toggleEditMode = () => {
    setEdit(!edit)
    console.log("Current edit", edit)
    if (edit) {
      console.log("edit mode enabled")
    } else {
      console.log("edit mode disabled: save to DB")
    }
  }

  const editModeEnabled = (
    <Row className={isDarkMode ? appStyle.NoteDetailsTest : appStyle.NoteDetailsRed}>
      <Col md={3}>
        <p>Title: <input type='text' defaultValue={title} onChange={handleUpdate} className={style.NoteInputRed} /></p>
      </Col>
      <Col md={3}>
        <p>Details: {details}</p>
      </Col>
      <Col md={3}>
        <p>Private: <input
          type="checkbox"
          name='newIs_private'
          defaultChecked={is_private}
          defaultValue={true}
          onChange={handleChecked}
          className={appStyle.CheckBoxRed}
        /> {is_private ? 'Yes' : 'No'}</p>
      </Col>
      <Col md={3}>
        <p>Watched: <input
          type="checkbox"
          name='newToggle'
          defaultChecked={toggle}
          defaultValue={true}
          onChange={handleChecked}
        /> {toggle ? 'Yes' : 'No'}</p>
      </Col>
      <Col md={3}>
        <p>Created: {created}</p>
      </Col>
      <Col md={3}>
        <p>Updated: {updated}</p>
      </Col>
      <Col>
        <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} onClick={handleDelete}>Delete</button>
        <button className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}`} onClick={handleSend}>Save</button>
      </Col>
    </Row>
  )

  const editModeDisabled = (
    <Row className={isDarkMode ? appStyle.NoteDetailsTest : appStyle.NoteDetailsRed}>
      <Col md={3}>
        <p>Title: {title}</p>
      </Col>
      <Col md={3}>
        <p>Details: {details}</p>
      </Col>
      <Col md={3}>
        <p>Private: {is_private ? 'Yes' : 'No'}</p>
      </Col>
      <Col md={3}>
        <p>Watched: {toggle ? 'Yes' : 'No'}</p>
      </Col>
      <Col md={3}>
        <p>Created: {created}</p>
      </Col>
      <Col md={3}>
        <p>Updated: {updated}</p>
      </Col>
    </Row>
  )

  const noteDetailPage = (
    <>
      <Row className={`text-left`}>
        <Col xs={10}>
          <Link to={'/notes/'}><i className="fa-solid fa-arrow-left" />&nbsp;</Link>
        </Col>
        <Col xs={2}>
          <button className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} fa-solid fa-pen-to-square`} onClick={toggleEditMode}></button>
        </Col>
      </Row>
        {owner.id === user.id ? (edit ? (editModeEnabled) : (editModeDisabled))
        : (
        <Row className={isDarkMode ? appStyle.NoteDetailsTest : appStyle.NoteDetailsRed}>
          <Col md={3}><p>Title: {title}</p></Col>
          <Col md={3}><p>Details: {details}</p></Col>
        </Row>
      )}
      <Row>
        <Col>
          {image_url ? (<img src={image_url} className={style.ImageDetail} alt='note image'/>) : (<img src={image} className={style.ImageDetail} alt='note image'/>)}
        </Col>
      </Row>
    </>
  )

  const noteListPage = (
    <Link to={`note/${id}`} className={style.Link}>
      <Row className={isDarkMode ? style.NoteTest : style.NoteRed}>
        <Col xs={5}>
          {image_url ? (<img src={image_url} className={style.ImageList} alt='note image'/>) : (<img src={image} className={style.ImageList} alt='note image'/>)}
        </Col>
        <Col xs={5}>{title}</Col>
        <Col xs={2}>
          {is_private ? <i className={`fa-solid fa-lock ${style.Private}`}></i> : null}
          {toggle ? <i className={`fa-solid fa-eye ${style.Watched}`}></i> : null}
        </Col>
      </Row>
    </Link>
  )

  return (
    <Container >
      {detailPage ? (
        <>
          {noteDetailPage}
        </>
      ) : (
        <>
          {noteListPage}
        </>
      )}
    </Container>
  )
}

export default NoteItem