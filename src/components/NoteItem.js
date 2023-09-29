import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import style from '../styles/NoteItem.module.css'
import { DefaultURL } from '../api/DefaultURL';

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
    fetch(`${DefaultURL}/api/notes/${id}/detail/`, {
      method: 'DELETE',
      'headers': {
        'Content-Type': 'application/json'
      }
    })
    navigate('/')
  }

  const details = (
    <div>
      <p>Title: {title}</p>
      <p>Created on: {created}</p>
      <img src={image} className={style.Image} />
      <br/>
    </div>
  )

  return (
    <div>
        {notePage ? (
          <>
          {details}
          <Link to={'/'}>
            Back
          </Link>
          <button onClick={handleDelete}>Delete</button>
          <button>Edit</button>
        </>
        ) : (
          <>
            <Link to={`note/${id}`} className={style.Link}>
              {details}
            </Link>
          </>
        )}
    </div>
  )
}

export default NoteItem