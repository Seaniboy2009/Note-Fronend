import React, { useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { APIURL } from '../api/APIURL';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import appStyle from '../styles/App.module.css'

const ListCreate = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
      title: '',
    });

    const { title } = formData;

    const createNote = async () => {
        const formData  = new FormData()
  
        formData.append('title', title)
  
        try {
          await axios.post(`${APIURL}/api/list/`, formData)
          navigate('/')
        } catch (error) {
          console.log(error)
        }
    }

    const updateNote = (event) => {
        setFormData({...formData, title: event.target.value})
    }
  
  return (
    <div className={appStyle.Container}>
        <div>
            <Form.Group className="mb-3">
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control
                type="text"
                id="title"
                aria-describedby="title"
                onChange={updateNote}
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

export default ListCreate