import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import style from '../../styles/ListPage.module.css'
import appStyle from '../../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosInstance from '../../api/axiosDefaults';

import AuthContext from '../../contexts/AuthContext'
import Loader from '../../components/Loader';
import { useTheme } from '../../utils/ThemeSelection';

const ListPage = () => {

    const [myLists, setMyLists] = useState({ results: []})
    const [lists, setLists] = useState({ results: []})
    const [hasLoaded, setHasLoaded] = useState(false)
    let {user} = useContext(AuthContext)
    const {isDarkMode} = useTheme()

    useEffect(() => {
        const getMyLists = async () => {
            const {data} = await axiosInstance.get(`/api/lists/?owner=${user.user_id}`)
            console.log(data)
            setMyLists(data)
            setHasLoaded(true)
        }

        const getAllLists = async () => {
            const {data} = await axiosInstance.get(`/api/lists/`)
            const filteredData = data.results.filter(item => item.owner !== user.name);
            setLists({ results: filteredData });
            setHasLoaded(true)
        }

        const timer = setTimeout(() => {
            getMyLists()
            getAllLists()
        }, 1000)
        
        setHasLoaded(false)
    
        return () => {
            clearTimeout(timer)
        }

    }, [])


  return (
    <Container className={`${appStyle.Container}`}>
        <Container className={`${appStyle.Container}`}>
            <Row>
                <Col xs={3}>
                    <h4>Lists</h4>
                </Col>
                {hasLoaded ? (
                    <Col xs={9}>
                        <Link to={'list/create'}>
                            <button className={isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed}>Create<i className="fa-sharp fa-solid fa-plus" /></button>
                        </Link>
                    </Col>
          ) : (<></>)}
            </Row>
        </Container>
        <Container>
            {hasLoaded ? (
                <>
                <Row><Col><h5>My lists</h5></Col></Row>
                {myLists?.results?.map((list, index) => (
                    <Link key={index} to={`list/${list.id}`}>
                        <Row className={style.List}>
                            <Col xs={10}>
                                <h5 className={style.ListDetails}>{list.title}</h5>
                            </Col>
                            <Col>
                                {list.is_private ? <i className={`fa-solid fa-lock ${style.Private}`}></i> : null}
                            </Col>
                        </Row>
                    </Link>
                ))}
                <Row><Col><h5>Shared lists</h5></Col></Row>
                {lists?.results?.map((list, index) => (
                    <div key={index}>
                        {list.is_private ? null : (
                            <Link key={index} to={`list/${list.id}`}>
                                <Row className={style.List}>
                                    <Col xs={3}>
                                        <h5 className={style.ListDetails}>#{list.id}</h5>
                                    </Col>
                                    <Col xs={4}>
                                        <h5 className={style.ListDetails}>{list.title}</h5>
                                    </Col>
                                    <Col xs={3}>
                                        <h5 className={style.ListDetails}>{list.is_private ? 'private' : 'not private'}</h5>
                                    </Col>
                                    <Col>
                                        <i className='fa-solid fa-bars'/>
                                    </Col>
                                </Row>
                            </Link>
                        )}
                    </div>
                ))}
                </>
            ) : (
                <Loader spinner text='Loading lists, please wait' />
            )}
        </Container>
    </Container>
  )
}

export default ListPage