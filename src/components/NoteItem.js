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
    <Col className={style.Text}>
      <p>Title: {title}</p>
      <p>Created: {created}</p>
      <img src={image} className={style.ImageListPage} />
      <br/>
    </Col>
  )

  const detailsPage = (
    <Col className={style.Text}>
      <p>Title: {title}</p>
      <p>Created: {created}</p>
      <img src={image} className={style.ImageDetailPage} />
      <p>Details:</p>
    </Col>
  )

  return (
    <Container>
        {notePage ? (
          <Container>
            <Row className={style.ContainerDetail}>
              {detailsPage}
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
          <Container className={style.Container}>
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