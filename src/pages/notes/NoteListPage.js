import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import NoteItem from '../../components/NoteItem'
import appStyle from '../../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../../api/axiosDefaults';
import { useNavigate } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext'
import Loader from '../../components/Loader';

const NoteListPage = () => {

    const [myNotes, setMyNotes] = useState({ results: []})
    const [notes, setNotes] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
    const [errors, setErrors] = useState({})
    let {user} = useContext(AuthContext)
    const navigate = useNavigate()
  
    useEffect(() => {

      const getMyNotes = async () => {
        try {
          const {data} = await axiosInstance.get(`/api/notes/?owner=${user.user_id}`)
          setMyNotes(data)
          setHasLoaded(true)
          console.log(data)
        } catch (error) {
          const access = localStorage.getItem('access_token')
          if (error.response.status === 401 && access) {
            window.location.reload()
          } else if (!access) {
            navigate('/')
          } else {
            console.log('Other error')
          }
          setErrors(error)
        }
      }

      const getNotes = async () => {
        try {
          const {data} = await axiosInstance.get('/api/notes/')
          const filteredData = data.results.filter(item => item.owner !== user.name);
          setNotes({ results: filteredData });
          setHasLoaded(true)
          console.log(filteredData)
        } catch (error) {
          const access = localStorage.getItem('access_token')
          if (error.response.status === 401 && access) {
            window.location.reload()
          } else if (!access) {
            navigate('/')
          } else {
            console.log('Other error')
          }
          setErrors(error)
        }
      }
      
      const timer = setTimeout(() => {
        getMyNotes()
        getNotes()
      }, 1000)

      setHasLoaded(false)

      return () => {
        clearTimeout(timer)
      }

    }, [user, navigate])

  return (
    <Container fluid className={`${appStyle.Container}`}>
      <Container className={`text-center ${appStyle.Container}`}>
        <Row fluid xl={1}>
          <Col>
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
      <Container className={`text-center ${appStyle.Container}`}>
      {hasLoaded ? (
        <Container fluid className={appStyle.Container}>
          <Row><h4>My notes</h4></Row>
          <Row>
          {myNotes?.results?.map((note, index) => (
            <Col key={index}  md={4}>
              <NoteItem key={note.id} {...note} />
            </Col>
          ))}
          </Row>
          <Row><h4>All notes</h4></Row>
          <Row>
          {notes?.results?.map((note, index) => (
            <Col key={index}  md={4}>
            {note.is_private ? null : (
              <NoteItem key={note.id} {...note} />
            )}
            </Col>
          ))}
          </Row>
        </Container>
      ) : (
        <Loader spinner text='Loading notes, please wait' />
      )}
      </Container>
    </Container>
  )
}

export default NoteListPage