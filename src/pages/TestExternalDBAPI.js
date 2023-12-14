import React, { useEffect, useState} from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form';
import appStyle from '../styles/App.module.css'
import Container from 'react-bootstrap/Container';
import style from '../styles/Test.module.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Loader from '../components/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchMoreData, fetchMoreDataURL } from '../utils/utils'
import { useTheme } from '../utils/ThemeSelection';

const TestExternalDBAPI = () => {

    const [searchText, setSearchText] = useState('')
    const [hasLoaded, setHasLoaded] = useState(false)
    const [data, setData] = useState({ results: [] })
    const {isDarkMode} = useTheme()

    // https://rawg.io/settings
    const gameDB = {
        method: 'GET',
        url: `https://api.rawg.io/api/games?key=18803101f7154a5c989e1537749caa35&search=${searchText}`,
        // headers: {
        //     'X-RapidAPI-Key': 'de8286481d914464be861d7b5c335daf',
        //     'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
        // }
    };

    useEffect(() => {

        console.log('TEST PAGE: useEffect Called')
        console.log('TEST PAGE: Search text: ', searchText)

        // const getDataNew = async () => {
        //     try {
        //         // Search passed down from movies note title text
        //         const response = await axios.request(gameDB)
        //         console.log('auto Search list: ', response.data)
        //         setData(response.data)
        //         setHasLoaded(true)
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        // const timer = setTimeout(() => {
        //     getDataNew()
        // }, 1000);

        // return () => {
        //     clearTimeout(timer);
        // };

    }, [])

    const getDataNew = async () => {
        try {
            // Search passed down from movies note title text
            const response = await axios.request(gameDB)
            console.log('auto Search list: ', response.data)
            setData(response.data)
            setHasLoaded(true)
        } catch (error) {
            console.error(error);
        }
    }

    const handleInputChange = (event) => {
        setSearchText(event.target.value);
    }

  return (
    <>
    <Container  className={`${isDarkMode ? appStyle.BackgroundContainerTest : appStyle.BackgroundContainerSmallRed}`}>
        <Row>
            <Col>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="title"><p>Search for Game</p></Form.Label>
                    <Form.Control
                        type="text"
                        name='title'
                        id="title"
                        aria-describedby="title"
                        onChange={handleInputChange}
                    />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <button 
                className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`}
                onClick={getDataNew}
                >Search</button>
            </Col>
        </Row>
    </Container>
    <Container>
        {hasLoaded ? (
            <>
                <InfiniteScroll
                    dataLength={data.results.length}
                    next={() => fetchMoreData(data, setData)}
                    hasMore={!!data.next}
                    loader={<Loader spinner text='Loading, please wait' />}
                    >
                    {data.results.map((data, index) => (
                        <>
                        <Row key={index}>
                            <Col xs={8}>{data?.name}</Col>
                        </Row>
                        <Row>
                            <Col xs={12}><img className={style.Image} src={data.background_image ? data.background_image : null} /></Col>
                        </Row>
                        </>
                    ))}
                </InfiniteScroll>
            </>
            ) : (
                <Loader text='Search to get list' />
            )
        }
    </Container>
    </>
  )
}

export default TestExternalDBAPI