import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import NoteItem from '../components/NoteItem'
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext'

const NoteListPage = () => {

    const [notes, setNotes] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
    const [errors, setErrors] = useState({})
    let {user} = useContext(AuthContext)
    const navigate = useNavigate()
  
    useEffect(() => {

      const getMyNotes = async () => {
        try {
          const {data} = await axiosInstance.get('/api/notes/')
          // const {data} = await axiosInstance.get(`/api/notes/?owner=${user.user_id}`)
          setNotes(data)
          setHasLoaded(true)
        } catch (error) {
          const access = localStorage.getItem('access_token')
          if (error.response.status == 401 && access) {
            window.location.reload()
          } else if (!access) {
            navigate('/')
          } else {
            console.log('Other error')
          }
          setErrors(errors)
        }
      }
      
      const timer = setTimeout(() => {
        getMyNotes()
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
                <Col key={index}  md={4}>
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