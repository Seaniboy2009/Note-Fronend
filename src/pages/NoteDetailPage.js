import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import NoteItem from '../components/NoteItem'
import appStyle from '../styles/App.module.css'
import { Container } from 'react-bootstrap';
import axiosInstance from '../api/axiosDefaults';

const NoteDetailPage = () => {

  const { id } = useParams()
  const [note, setNote] = useState({})

  useEffect(() => {
    const getNotes = async () => {
      // const response = await fetch(`${APIURL}/api/notes/${id}`)
      const {data} = await axiosInstance.get(`/api/notes/${id}`)
      // const data = await response.json()
      setNote(data)
      console.log(data)
   }
    
    // Set a timer to call the get notes after x seconds
    const timer = setTimeout(() => {
      getNotes()
    },)

    // clear the timer
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <Container fluid className={appStyle.Container}>
      <NoteItem key={id} {...note} notePage />
    </Container>
  )
}

export default NoteDetailPage