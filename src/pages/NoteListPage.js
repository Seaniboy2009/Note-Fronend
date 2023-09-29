import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div className={appStyle.Container}>
      <h3>NoteListPage</h3>
      <br/>
      <Link to={'note/create'}>
        <button>Create</button>
      </Link>
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