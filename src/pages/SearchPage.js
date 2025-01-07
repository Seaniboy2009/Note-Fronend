import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../styles/Test.module.css";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreDataURL } from "../utils/utils";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../contexts/ThemeSelection";
const SearchPage = ({
  searchText,
  searchPage,
  handlePickedImageFromList,
  gameSearch,
  category,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState({ results: [] });
  const [searchList, setSearchList] = useState("Movie");
  const { theme, activeTheme } = useTheme();
  // Movie DB
  const autoSearch = {
    method: "GET",
    url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${searchText}`,
    params: {
      exact: "false",
      titleType: "movie",
    },
    headers: {
      "X-RapidAPI-Key": "2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf",
      "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
    },
  };

  // Games DB
  // https://rawg.io/apidocs
  const gameOptions = {
    method: "GET",
    url: "https://api.rawg.io/api/games?",
    params: {
      key: "0d185fccaba345f3af4c725478c4b7f7", // API key as a query parameter
      dates: "2019-09-01,2019-09-30", // Date range as query parameter
      platforms: "18,1,7", // Platforms as query parameter
    },

    // method: "GET",
    // url: "https://rawg-video-games-database.p.rapidapi.com/games",
    // headers: {
    //   "X-RapidAPI-Key": "2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf",
    //   "X-RapidAPI-Host": "rawg-video-games-database.p.rapidapi.com",
    // },
  };

  // Get api data after query is updated
  useEffect(() => {
    const getDataNew = async () => {
      if (hasSearched) {
        try {
          // Search passed down from movies note title text
          if (searchList === "Movie") {
            const response = await axios.request(autoSearch);
            console.log("auto Search list: ", response.data);
            setData(response.data);
            setHasLoaded(true);
          } else if (searchList === "Game") {
            // Search passed down from games note title
            const response = await axios.request(gameOptions);
            console.log("game Search list: ", response.data);
            setData(response.data);
            setHasLoaded(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const checkIsSearching = () => {
      if (searchText === "") {
        console.log("Search is null");
        setHasSearched(false);
      } else {
        console.log("User has typed:", searchText);
        setHasSearched(true);
      }
    };

    const checkSearchList = () => {
      console.log("Search list is: ", searchList);
    };

    const timer = setTimeout(() => {
      getDataNew();
      checkIsSearching();
      checkSearchList();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, searchPage, gameSearch, category, searchList, hasSearched]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <ThemedButton onClick={() => setSearchList("Game")}>
              Games
            </ThemedButton>
          </Col>
          <Col>
            <ThemedButton onClick={() => setSearchList("Movie")}>
              Movies
            </ThemedButton>
          </Col>
        </Row>
      </Container>
      <br />
      {hasSearched && hasLoaded ? (
        <Container
          style={{
            backgroundColor: theme[activeTheme].panelColor,
            border: theme[activeTheme].border,
            marginBottom: "10px",
          }}
        >
          <InfiniteScroll
            dataLength={data.results.length}
            next={() => fetchMoreDataURL(data, setData)}
            hasMore={!!data.next}
            loader={<Loader spinner text="Loading, please wait" />}
          >
            {data.results.map((data, index) => (
              <>
                {searchList === "Movie" ? (
                  <>
                    {" "}
                    <Row key={index}>
                      <Col xs={8}>{data.titleText?.text}</Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        <img
                          className={style.Image}
                          src={
                            data.primaryImage?.url
                              ? data.primaryImage.url
                              : null
                          }
                          alt={data.titleText?.text}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {data.primaryImage?.url ? (
                        <Col
                          xs={12}
                          style={{
                            paddingBottom: "10px",
                            borderBottom: "4px solid black",
                          }}
                        >
                          <ThemedButton
                            onClick={() => {
                              handlePickedImageFromList(data.primaryImage.url);
                              window.scrollTo(0, 0);
                            }}
                            value={data.primaryImage.url}
                          >
                            Use image
                          </ThemedButton>
                        </Col>
                      ) : null}
                    </Row>
                  </>
                ) : (
                  <>
                    {" "}
                    <Row key={index}>
                      <Col xs={8}>
                        {data.titleText?.text ? data.titleText?.text : null}
                        {data.name ? data.name : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12}>
                        {data.background_image ? (
                          <img
                            className={style.Image}
                            src={data.background_image}
                            alt={data.titleText?.text}
                          />
                        ) : null}
                      </Col>
                    </Row>
                    <Row>
                      {data.primaryImage?.url ? (
                        <Col
                          xs={12}
                          style={{
                            paddingBottom: "10px",
                            borderBottom: "4px solid black",
                          }}
                        >
                          <ThemedButton
                            onClick={() => {
                              handlePickedImageFromList(data.primaryImage.url);
                              window.scrollTo(0, 0);
                            }}
                            value={data.primaryImage.url}
                          >
                            Use image
                          </ThemedButton>
                        </Col>
                      ) : null}
                      {data.background_image ? (
                        <Col
                          xs={12}
                          style={{
                            paddingBottom: "10px",
                            borderBottom: "4px solid black",
                          }}
                        >
                          <ThemedButton
                            onClick={() => {
                              handlePickedImageFromList(data.background_image);
                              window.scrollTo(0, 0);
                            }}
                            value={data.background_image}
                          >
                            Use image
                          </ThemedButton>
                        </Col>
                      ) : null}
                    </Row>
                  </>
                )}
              </>
            ))}
          </InfiniteScroll>
        </Container>
      ) : (
        <Loader text="Please begin typing to get suggestions below" />
      )}
    </>
  );
};

export default SearchPage;
