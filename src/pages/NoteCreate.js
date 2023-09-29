import React, { useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import appStyle from '../styles/App.module.css'

const NoteCreate = () => {
    const navigate = useNavigate()
    const imageInput = useRef(null)
    const [formData, setFormData] = useState({
      title: '',
      image: '',
    });

    const { title } = formData;

    const createNote = async () => {
        const formData  = new FormData()
  
        formData.append('title', title)
        formData.append('image', imageInput.current.files[0])
  
        try {
          await axios.post("https://note-backend-api-19a13319c6ea.herokuapp.com/api/notes/create/", formData)
          navigate('/')
        } catch (error) {
          console.log(error)
        }
    }

    const updateNote = (event) => {
        setFormData({...formData, title: event.target.value})
    }
  
    const handleChangeImage = (event) => {
  
        setFormData({
            ...formData,
            image: URL.createObjectURL(event.target.files[0]),
    })}

  return (
    <div className={appStyle.Container}>
        <div>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="inputPassword5">Title</Form.Label>
            <Form.Control
                type="text"
                id="title"
                aria-describedby="title"
                onChange={updateNote}
            />
            <Form.Label>Image</Form.Label>
            <Form.Control 
                type="file"
                onChange={handleChangeImage}
                ref={imageInput}
            />
            </Form.Group>
            <button onClick={createNote}>Create</button>
            <Link to={'/'}>
             <button>Back</button>
            </Link>
        </div>
    </div>
  )
}

export default NoteCreate