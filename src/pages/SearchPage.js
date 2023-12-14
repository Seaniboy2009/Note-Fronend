import React, { useEffect, useState } from 'react'
import axios from 'axios';
import appStyle from '../styles/App.module.css'
import style from '../styles/Test.module.css'
import Container from 'react-bootstrap/Container'
import { Col, Row } from 'react-bootstrap'
import Loader from '../components/Loader'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchMoreData, fetchMoreDataURL } from '../utils/utils'
import { useTheme } from '../utils/ThemeSelection'
// import { useTheme } from '../utils/ThemeSelection';

const SearchPage = ( { searchText, searchPage, pickedImage, gameSearch, category } ) => {

    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [data, setData] = useState({ results: [] })
    const {isDarkMode, toggleDarkMode} = useTheme()
    const [searchList, setSearchList] = useState('Movie')

    // Movie DB
    const autoSearch = {
        method: 'GET',
        url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${searchText}`,
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
          'X-RapidAPI-Key': '2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf',
          'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
        }
    };

    // Get api data after query is updated
    useEffect(() => {
        console.log('useEffect Called')
        const getDataOld = async () => {
            try {
                // Search passed down from movies note title text
                if(searchPage && hasSearched) {
                    const response = await axios.request(autoSearch)
                    console.log('auto Search list: ', response.data)
                    setData(response.data)
                    setHasLoaded(true)
                } else if (gameSearch && hasSearched) {
                    // Search passed down from games note title
                    const response = await axios.request(gameOptions)
                    console.log('game Search list: ', response.data)
                    setData(response.data)
                    setHasLoaded(true)
                }
            } catch (error) {
                console.error(error);
            }
        }

        const getDataNew = async () => {

            if (hasSearched) {
                try {
                    // Search passed down from movies note title text
                    if(searchList === 'Movie') {
                        const response = await axios.request(autoSearch)
                        console.log('auto Search list: ', response.data)
                        setData(response.data)
                        setHasLoaded(true)
                    } else if (searchList === 'Game') {
                        // Search passed down from games note title
                        const response = await axios.request(gameOptions)
                        console.log('game Search list: ', response.data)
                        setData(response.data)
                        setHasLoaded(true)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        const checkIsSearching = () => {
            if (searchText === '') {
                console.log('Search is null')
                setHasSearched(false)
            } else {
                console.log('User has typed:', searchText)
                setHasSearched(true)
            }
        }

        const checkSearchList = () => {
            console.log('Search list is: ', searchList)
        }

        const timer = setTimeout(() => {
            getDataNew()
            checkIsSearching()
            checkSearchList()
        }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [searchText, searchPage, gameSearch, category, searchList, hasSearched])


    // const movieList = (
    //     <>
    //     <Row key={index}>
    //         <Col xs={8}>{data.titleText?.text}</Col>
    //         <Col xs={4}>{data.releaseYear?.year}</Col>
    //     </Row>
    //     <Row>
    //         <Col xs={12}><img className={style.Image} src={data.primaryImage?.url ? data.primaryImage.url : null} /></Col>
    //     </Row>
    //     <Row>
    //         {data.primaryImage?.url ? (
    //             <Col xs={12}><button className={appStyle.Button} onClick={() => pickedImage(data.primaryImage.url)} value={data.primaryImage.url}>Use image</button></Col>
    //         ) : null}
    //     </Row>
    //     </>
    // )

    // const gameList = (
    //     <>
    //     <Row key={index}>
    //         <Col xs={8}>{data.titleText?.text}</Col>
    //         <Col xs={4}>{data.releaseYear?.year}</Col>
    //     </Row>
    //     <Row>
    //         <Col xs={12}><img className={style.Image} src={data.primaryImage?.url ? data.primaryImage.url : null} /></Col>
    //     </Row>
    //     <Row>
    //         {data.primaryImage?.url ? (
    //             <Col xs={12}><button className={appStyle.Button} onClick={() => pickedImage(data.primaryImage.url)} value={data.primaryImage.url}>Use image</button></Col>
    //         ) : null}
    //     </Row>
    //     </>
    // )

    const loadMore = (
        <>
            {hasLoaded ? (
              <>
                  <InfiniteScroll
                    dataLength={data.results.length}
                    next={() => fetchMoreDataURL(data, setData)}
                    hasMore={!!data.next}
                    loader={<Loader spinner text='Loading, please wait' />}
                    >
                    {data.results.map((data, index) => (
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
                </InfiniteScroll>
              </>
            ) : (
                <Loader spinner text='Loading Recomended' />
            )}
        </>
    )
    
  return (
    <Container className={`${isDarkMode ? appStyle.BackgroundContainerTest : appStyle.BackgroundContainerSmallRed}`}>
        <Row>
            <Col>
            <button 
                className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`}
                onClick={() => setSearchList('Game')}
                >Game</button>
            <button 
                className={`${isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed} ${appStyle.ButtonLarge}`}
                onClick={() => setSearchList('Movie')}
                >Movie</button>
            </Col>
        </Row>
        {hasSearched ? (
            loadMore
        ) : 
            <Loader text='Please begin typing to get sugestions below' />
        }
    </Container>
  )
}

export default SearchPage