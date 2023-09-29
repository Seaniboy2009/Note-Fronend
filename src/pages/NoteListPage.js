import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import NoteItem from '../components/NoteItem'
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import appStyle from '../styles/App.module.css'
import { DefaultURL } from '../api/DefaultURL';

const NoteListPage = () => {
    const [notes, setNotes] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const navigate = useNavigate()
    const imageInput = useRef(null)
    const [formData, setFormData] = useState({
      title: '',
      image: '',
    });

    const { title } = formData;

    useEffect(() => {
      const getNotes = async () => {
        const response = await fetch(`${DefaultURL}/api/notes/`)
        const data = await response.json()
        setNotes(data)
        setHasLoaded(true)
     }
      
      // Set a timer to call the get notes after x seconds
      const timer = setTimeout(() => {
        getNotes()
      }, 1000)

      // Set has loaded to false
      setHasLoaded(false)

      // clear the timer
      return () => {
        clearTimeout(timer)
      }
    }, [])

    const createNote = async () => {
      const formData  = new FormData()

      formData.append('title', title)
      formData.append('image', imageInput.current.files[0])

      try {
        await axios.post("/api/notes/create/", formData)
        
      } catch (error) {
        console.log(error)
      }
      navigate('/')
    }

    const updateNote = (event) => {
      setFormData({...formData, title: event.target.value})
    }

    const handleChangeImage = (event) => {

      setFormData({
          ...formData,
          image: URL.createObjectURL(event.target.files[0]),
      });
  };

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
      </div>
      <h3>NoteListPage</h3>
      <br/>
      <button onClick={createNote}>Create</button>
      {hasLoaded ? (
          <div className={appStyle.Notes}>
            {notes?.map((note, index) => (
                <NoteItem key={index} {...note} />
            ))}
          </div>
        ) : (
          <h3>Loading...</h3>
        )
      }
    </div>
  )
}

export default NoteListPage