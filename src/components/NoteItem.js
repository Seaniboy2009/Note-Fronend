import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from '../styles/NoteItem.module.css'
import appStyle from '../styles/App.module.css'
import { APIURL } from '../api/APIURL';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NoteItem = ( props ) => {
  const {
    id,
    title,
    created,
    image,
    notePage,
  } = props
  const navigate = useNavigate()

  const handleDelete = async () => {
    fetch(`${APIURL}/api/notes/${id}/detail/`, {
      method: 'DELETE',
      'headers': {
        'Content-Type': 'application/json'
      }
    })
    navigate('/')
  }

  const listPage = (
    <div>
      <p>Title: {title}</p>
      <p>Created on: {created}</p>
      <img src={image} className={style.ImageListPage} />
      <br/>
    </div>
  )

  const detailsPage = (
    <div>
      <p>Title: {title}</p>
      <p>Created on: {created}</p>
      <img src={image} className={style.ImageDetailPage} />
      <br/>
    </div>
  )

  return (
    <Container>
        {notePage ? (
          <Container>
            <Row className={style.ContainerDetail}>
              <Col>
              {detailsPage}
              </Col>
            </Row>
            <Row className={style.ButtonContainer}> 
              <Col>
              <Link to={'/notes/'}>
                <button className={appStyle.Button}>Back</button>
              </Link>
              <button className={appStyle.Button} onClick={handleDelete}>Delete</button>
              <button className={appStyle.Button}>Edit</button>
              </Col>
            </Row>
          </Container>
        ) : (
          <div className={style.Container}>
            <Link to={`note/${id}`} className={style.Link}>
              {listPage}
            </Link>
          </div>
        )}
    </Container>
  )
}

export default NoteItem