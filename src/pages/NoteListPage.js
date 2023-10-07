import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { APIURL } from '../api/APIURL';
import { DEVAPIURL } from '../api/APIURL';
import NoteItem from '../components/NoteItem'

import style from '../styles/NoteListPage.module.css'
import appStyle from '../styles/App.module.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../api/axiosDefaults';

const NoteListPage = () => {

    const [notes, setNotes] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
  
    useEffect(() => {

      const getNotes = async () => {
        const {data} = await axiosInstance.get('/api/notes/',)
        console.log(data)
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
      <Container>
        <Row>
          <Col md={1}>
            <h3>Notes</h3>
          </Col>
          {hasLoaded ? (
            <Col>
              <Link to={'note/create'}>
                <button className={appStyle.Button}>Create<i className="fa-sharp fa-solid fa-plus" /></button>
              </Link>
            </Col>
          ) : (<></>)}
        </Row>
      </Container>
      <Container>
      {hasLoaded ? (
        <Container className={appStyle.Container}>
          <Row>
          {notes?.results?.map((note, index) => (
                <Col key={index}  xl={3}>
                  <NoteItem key={index} {...note} />
                </Col>
          ))}
          </Row>
        </Container>
          ) : (
            <Row>
              <Col>
                <h3>Loading...</h3>
              </Col>
          </Row>
      )}
      </Container>
    </Container>
  )
}

export default NoteListPage