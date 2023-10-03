import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import NoteItem from '../components/NoteItem'
import appStyle from '../styles/App.module.css'
import { APIURL } from '../api/APIURL';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NoteListPage = () => {
    const [notes, setNotes] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)

    useEffect(() => {
      const getNotes = async () => {
        const response = await fetch(`${APIURL}/api/notes/`)
        const data = await response.json()
        setNotes(data)
        setHasLoaded(true)
     }
      
      const timer = setTimeout(() => {
        getNotes()
      }, 1000)

      setHasLoaded(false)

      return () => {
        clearTimeout(timer)
      }
    }, [])

  return (
    <div className={appStyle.Container}>
      <Container className='text-center'>
        <Row>
          <Col><h3>NoteListPage</h3></Col>
        </Row>
        <Row>
          <Col>
            <Link to={'note/create'}>
              <button>Create</button>
            </Link>
          </Col>
        </Row>
      </Container>
      <Container>
          {hasLoaded ? (
            <Row>
              {notes?.map((note, index) => (
                <Col key={index} md="auto">
                  <NoteItem key={index} {...note} />
                </Col>
              ))}
            </Row>
          ) : (
            <Row>
              <Col md="auto">
                <h3>Loading...</h3>
              </Col>
            </Row>
          )}
      </Container>
    </div>
  )
}

export default NoteListPage