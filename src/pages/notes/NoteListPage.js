import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import NoteItem from '../../components/NoteItem'
import appStyle from '../../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {axiosInstance} from '../../api/axiosDefaults';
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchMoreData, fetchMoreDataURL } from '../../utils/utils'
import AuthContext from '../../contexts/AuthContext'
import Loader from '../../components/Loader';
import { useTheme } from '../../utils/ThemeSelection';

const NoteListPage = () => {

    const [myNotes, setMyNotes] = useState({ results: []})
    const [notes, setNotes] = useState({ results: []})
    const [viewSelection, setViewSelection] = useState('All')
    const [hasLoaded, setHasLoaded] = useState(false)
    const [errors, setErrors] = useState({})
    let {user} = useContext(AuthContext)
    const navigate = useNavigate()
    const {isDarkMode} = useTheme()
  
    useEffect(() => {

      const getMyNotes = async () => {
        try {
          const {data} = await axiosInstance.get(`/api/notes/?owner=${user.user_id}`)
          setMyNotes(data)
          setHasLoaded(true)
          console.log('Get my notes data:', data)
        } catch (error) {
          const access = localStorage.getItem('access_token')
          if (error.response?.status === 401 && access) {
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
          console.log('Get other notes data:', filteredData)
        } catch (error) {
          const access = localStorage.getItem('access_token')
          if (error.response?.status === 401 && access) {
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

    }, [user, navigate, viewSelection])

    const handleChangeSelection = (event) => {
      if (event.target.name === 'Other') {
        console.log('Other')
        setViewSelection('Other')
      } else if (event.target.name === 'Movie') {
        console.log('Movie')
        setViewSelection('Movie')
      } else if (event.target.name === 'Game') {
        console.log('Game')
        setViewSelection('Game')
      } else if (event.target.name === 'All') {
        console.log('All')
        setViewSelection('All')
      }
    }

  return (
    <Container fluid className={`${appStyle.Container}`}>
      <Container className={`${appStyle.Container}`}>
        <Row>
          <Col>
            <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} onClick={handleChangeSelection} name='All'>All</button>
          </Col>
          <Col>
            <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} onClick={handleChangeSelection} name='Movie'>Movies</button>
          </Col>
          <Col>
            <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} onClick={handleChangeSelection} name='Game'>Games</button>
          </Col>
          <Col>
            <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} onClick={handleChangeSelection} name='Other'>Other</button>
          </Col>
        </Row>
      </Container>
      <Container className={`text-center`}>
      {hasLoaded ? (
        <Container>
          <Row><h5>My notes</h5></Row>
            {hasLoaded ? (
              <Col xs={5}> 
                <Link to={'note/create'}>
                  <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonCreate}><i className="fa-sharp fa-solid fa-plus" /></button>
                </Link>
              </Col>
            ) : null}
            {/* <Row>
              <InfiniteScroll
                      dataLength={myNotes.results.length}
                      next={() => fetchMoreData(myNotes, setMyNotes)}
                      hasMore={!!myNotes.next}
                      loader={<Loader spinner text='Loading, please wait' />}
                      >
                      {myNotes?.results?.map((note, index) => (
                        <NoteItem key={index} {...note} />
                      ))}
              </InfiniteScroll>
            </Row> */}
            <Row>
              <InfiniteScroll
                      dataLength={myNotes.results.length}
                      next={() => fetchMoreData(myNotes, setMyNotes)}
                      hasMore={!!myNotes.next}
                      loader={<Loader spinner text='Loading, please wait' />}
                      >
                      {myNotes?.results?.map((note, index) => (
                        <>
                          {/* {viewSelection === note.category ? (<NoteItem key={index} {...note} />) : null} */}
                          {viewSelection === 'All' || viewSelection === note.category ? (<NoteItem key={index} {...note} />) : null}
                        </>
                      ))}
              </InfiniteScroll>
            </Row>
          <Row><h5>All notes</h5></Row>
          {notes?.results?.map((note, index) => (
            <Row key={index}>
              {note.is_private ? null : (<NoteItem key={index} {...note} />)}
            </Row>
          ))}
        </Container>
      ) : (
        <Loader spinner text='Loading notes, please wait' />
      )}
      </Container>
    </Container>
  )
}

export default NoteListPage