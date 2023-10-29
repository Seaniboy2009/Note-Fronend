import React, { useState } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import appStyle from '../styles/App.module.css'
import Form from 'react-bootstrap/Form';
import style from '../styles/Test.module.css'

import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';

const TestPage = () => {

    const [hasLoaded, setHasLoaded] = useState(false);
    const [data, setData] = useState({ results: [] })
    const [query, setQuery] = useState("");


    const options = {
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
      };

    const testGet = () => {

        const getData = async () => {
            try {
                const response = await axios.request(options);
                console.log(response.data);
                setData(response.data)
                setHasLoaded(true)
            } catch (error) {
                console.error(error);
            }
        }

        setHasLoaded(false)
        const timer = setTimeout(() => {
            getData()
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }
    
  return (
    <Container fluid className={`text-center ${appStyle.Container}`}>
        <Row className="justify-content-md-center">
            <Col>TestPage</Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md={6}>
            <Form onSubmit={(event) => event.preventDefault()}>
                <Form.Control
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type='text'
                    // className='mr-sm-2'
                    placeholder='Search Movies'
                ></Form.Control>
            </Form>
            </Col>
        </Row>
        <Row>
            <Col>
                <button onClick={testGet} className={appStyle.Button}>TestGet</button>
            </Col>
        </Row>
        <Row className="justify-content-md-center">
            <Col md={6}>
                {hasLoaded ? (
                    <Table className={appStyle.Table}>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Release Year</th>
                            <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.results.map((data, index) => (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{data.titleText.text}</td>
                                    <td>{data.releaseYear.year}</td>
                                    <td><img className={style.Image} src={data.primaryImage?.url ? data.primaryImage.url : null} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (<>Loading...</>)}
            </Col>
        </Row>
    </Container>
  )
}

export default TestPage