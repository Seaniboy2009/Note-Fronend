import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import appStyle from '../styles/App.module.css'
import Form from 'react-bootstrap/Form';
import style from '../styles/Test.module.css'

import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import Loader from '../components/Loader';
import { useTheme } from '../utils/ThemeSelection';

const TestPage = ( { search, searchPage } ) => {


    const [hasLoaded, setHasLoaded] = useState(false);
    const [data, setData] = useState({ results: [] })
    const [query, setQuery] = useState('');
    const {isDarkMode} = useTheme()


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

    //   Get api date once confirm button is pressed
    // const testGet = () => {

    //     const getData = async () => {
    //         try {
    //             const response = await axios.request(options);
    //             console.log('Search list: ', response.data);
    //             setData(response.data)
    //             setHasLoaded(true)
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }

    //     setHasLoaded(false)
    //     const timer = setTimeout(() => {
    //         getData()
    //     }, 1000);

    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }

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
                // const response = await axios.request(options);
                // console.log('Search list: ', response.data);
                // setData(response.data)
                // setHasLoaded(true)
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

    console.log('Search: ', search)
    console.log('Quary: ', query)
    
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
            <Row>
                {hasLoaded ? (
                    <Table className={isDarkMode ? appStyle.TableTest : appStyle.TableRed}>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Release Year</th>
                            <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.results?.map((data, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{data.titleText?.text}</td>
                                    <td>{data.releaseYear?.year}</td>
                                    <td><img className={style.Image} src={data.primaryImage?.url ? data.primaryImage.url : null} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : null}
            </Row>
        </Container>
    </Container>
  )
}

export default TestPage