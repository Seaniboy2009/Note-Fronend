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
        <div className={style.Container}>
          {details}
          <div className={style.ButtonContainer}> 
            <Link to={'/'}>
              <button className={style.Button}>Back</button>
            </Link>
            <button className={style.Button} onClick={handleDelete}>Delete</button>
            <button className={style.Button}>Edit</button>
          </div>
        </div>
        ) : (
          <div>
            <Link to={`note/${id}`} className={style.Link}>
              {details}
            </Link>
          </div>
        )}
    </div>
  )
}

export default NoteItem