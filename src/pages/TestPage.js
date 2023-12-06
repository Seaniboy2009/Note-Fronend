import React, { useEffect, useState } from 'react'
import axios from 'axios';
import appStyle from '../styles/App.module.css'
import Form from 'react-bootstrap/Form';
import style from '../styles/Test.module.css'

import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
// import { useTheme } from '../utils/ThemeSelection';

const TestPage = ( { search, searchPage, pickedImage, gameSearch } ) => {

    const [hasLoaded, setHasLoaded] = useState(false);
    const [data, setData] = useState({ results: [] })
    const [query, setQuery] = useState('')
    

    const autoSearch = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${search}`,
        params: {
            exact: 'false',
            titleType: 'movie'
        },
        headers: {
          'X-RapidAPI-Key': '2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    }

    // Movies DB
    const manualSearch = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${query}`,
        params: {
            exact: 'false',
            titleType: 'movie'
        },
        headers: {
          'X-RapidAPI-Key': '2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    }

    // Games DB
    const gameOptions = {
        method: 'GET',
        url: 'https://rawg-video-games-database.p.rapidapi.com/games',
        headers: {
          'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
          'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
        }
      };

    // Get api data after query is updated
    useEffect(() => {
        const getData = async () => {
            try {
                // Search passed down from movies note title text
                if(searchPage) {
                    const response = await axios.request(autoSearch)
                    console.log('auto Search list: ', response.data)
                    setData(response.data)
                    setHasLoaded(true)
                } else if (gameSearch) {
                    // Search passed down from games note title
                    const response = await axios.request(gameOptions)
                    console.log('game Search list: ', response.data)
                    setData(response.data)
                    setHasLoaded(true)
                } else {
                    // Search manualy typed on this component
                    const response = await axios.request(manualSearch)
                    console.log('manual Search list: ', response.data)
                    setData(response.data)
                    setHasLoaded(true)
                }
            } catch (error) {
                console.error(error);
            }
        }

        const timer = setTimeout(() => {
            getData()
        }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [query, search])

    const handleChange = (event) => {
        setQuery(event.target.value)
    }

    const newLayout = (
        <>
        {data.results?.map((data, index) => (
            <>
            <Row key={index}>
                <Col xs={8}>{data.titleText?.text}</Col>
                <Col xs={4}>{data.releaseYear?.year}</Col>
            </Row>
            <Row>
                <Col xs={12}><img className={style.Image} src={data.primaryImage?.url ? data.primaryImage.url : null} /></Col>
            </Row>
            <Row>
                {data.primaryImage?.url ? (
                    <Col xs={12}><button className={appStyle.Button} onClick={() => pickedImage(data.primaryImage.url)} value={data.primaryImage.url}>Use image</button></Col>
                ) : null}
            </Row>
            </>
        ))}
        </>
    )
    
  return (
    <Container>
        {searchPage ? (
            null
        ) : (
        <Container>
            <Row>
                <Col>
                    <Form onSubmit={(event) => event.preventDefault()}>
                        <Form.Control
                            value={query}
                            onChange={handleChange}
                            type='text'
                            placeholder='Start typing to search movies'
                        ></Form.Control>
                    </Form>
                </Col>
            </Row>
        </Container>
        )}
        <Container>
            <>
                {hasLoaded ? (newLayout)
                    : <Loader spinner text='Loading, please wait' />
                }
            </>
        </Container>
    </Container>
  )
}

export default TestPage