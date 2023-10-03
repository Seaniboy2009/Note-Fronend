import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from '../styles/NoteItem.module.css'
import appStyle from '../styles/App.module.css'
import { APIURL } from '../api/APIURL';
import { Container } from 'react-bootstrap';

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
    <Container fluid className={appStyle.Container}>
        {notePage ? (
        <div className={style.ContainerDetail}>
          {detailsPage}
          <div className={style.ButtonContainer}> 
            <Link to={'/'}>
              <button className={style.Button}>Back</button>
            </Link>
            <button className={style.Button} onClick={handleDelete}>Delete</button>
            <button className={style.Button}>Edit</button>
          </div>
        </div>
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