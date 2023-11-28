import React, { useEffect, useState } from 'react'
import axios from 'axios';
import appStyle from '../styles/App.module.css'
import Form from 'react-bootstrap/Form';
import style from '../styles/Test.module.css'

import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
// import { useTheme } from '../utils/ThemeSelection';

const TestPage = ( { search, searchPage, pickedImage } ) => {


    const [hasLoaded, setHasLoaded] = useState(false);
    const [data, setData] = useState({ results: [] })
    const [query, setQuery] = useState('');
    // const [pickImage, setPickImage] = useState('')
    // const {isDarkMode} = useTheme()


    const optionsSearch = {
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

    const optionsQuary = {
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

    // Get api data after query is updated
    useEffect(() => {
        const getData = async () => {
            try {
                if(searchPage) {
                    const response = await axios.request(optionsSearch);
                    console.log('Search list: ', response.data);
                    setData(response.data)
                    setHasLoaded(true)
                } else {
                    const response = await axios.request(optionsQuary);
                    console.log('Search list: ', response.data);
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
                            // onChange={(event) => setQuery(event.target.value)}
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
                {hasLoaded ? (
                    <>
                    {newLayout}
                    </>
                ) : <Loader spinner text='Loading, please wait' />}
            </>
        </Container>
    </Container>
  )
}

export default TestPage