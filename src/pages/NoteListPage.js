import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import NoteItem from '../components/NoteItem'
import appStyle from '../styles/App.module.css'
import style from '../styles/NoteListPage.module.css'
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
    <Container fluid className={appStyle.Container}>
      <Container fluid className={style.Container}>
        <Row>
          <Col>
            <h4>Notes</h4>
          </Col>
          {hasLoaded ? (
            <Col>
              <Link to={'note/create'}>
                <button className={appStyle.Button}>Create</button>
              </Link>
            </Col>
          ) : (<></>)}
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
              <Col>
                <h4>Loading...</h4>
              </Col>
          </Row>
      )}
      </Container>
    </Container>
  )
}

export default NoteListPage