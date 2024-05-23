import React, { useEffect, useState } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import appStyle from "../styles/App.module.css";
import Container from "react-bootstrap/Container";
import style from "../styles/Test.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData, fetchMoreDataURL } from "../utils/utils";
import { useTheme } from "../contexts/ThemeSelection";

const TestExternalDBAPI = () => {
  const [searchText, setSearchText] = useState("");
  const [searchDB, setSearchDB] = useState("Game");
  const [hasTyped, setHasTyped] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [data, setData] = useState({ results: [] });
  const { isDarkMode } = useTheme();

  // https://rawg.io/settings
  const gameDB = {
    method: "GET",
    url: `https://api.rawg.io/api/games?key=18803101f7154a5c989e1537749caa35&search=${searchText}`,
  };

  const movieDB = {
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

  useEffect(() => {
    console.log("TEST PAGE: useEffect Called");
    console.log("TEST PAGE: Search text: ", searchText);
    console.log("TEST PAGE: SearchDB: ", searchDB);
    console.log("TEST PAGE: Has typed: ", hasTyped);

    const checkHasTyped = () => {
      if (searchText !== "") {
        setHasTyped(true);
      } else {
        setHasTyped(false);
      }
    };

    const getData = async () => {
      if (hasTyped) {
        try {
          if (searchDB === "Game") {
            const response = await axios.request(gameDB);
            setData(response.data);
            console.log("auto Search list: ", response.data);
          } else {
            const response = await axios.request(movieDB);
            setData(response.data);
            console.log("auto Search list: ", response.data);
          }
          setHasLoaded(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("not typed yet");
      }
    };

    const timer = setTimeout(() => {
      getData();
      checkHasTyped();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchDB]);

  const getData = async () => {
    try {
      // Search passed down from movies note title text
      if (searchDB === "Game") {
        const response = await axios.request(gameDB);
        setData(response.data);
        console.log("auto Search list: ", response.data);
      } else {
        const response = await axios.request(movieDB);
        setData(response.data);
        console.log("auto Search list: ", response.data);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const movieLayout = (
    <InfiniteScroll
      dataLength={data.results.length}
      next={() => fetchMoreDataURL(data, setData)}
      hasMore={!!data.next}
      loader={<Loader spinner text="Loading, please wait" />}
    >
      {data.results.map((data, index) => (
        <rea>
          <Row key={index}>
            <Col xs={8}>{data.titleText?.text}</Col>
            <Col xs={4}>{data.releaseYear?.year}</Col>
          </Row>
          <Row>
            <Col xs={12}>
              <img
                className={style.Image}
                src={data.primaryImage?.url ? data.primaryImage.url : null}
              />
            </Col>
          </Row>
          <Row>
            {data.primaryImage?.url ? (
              <Col xs={12}>
                <button
                  className={appStyle.Button}
                  value={data.primaryImage.url}
                >
                  Use image
                </button>
              </Col>
            ) : // <Col xs={12}><button className={appStyle.Button} onClick={() => pickedImage(data.primaryImage.url)} value={data.primaryImage.url}>Use image</button></Col>
            null}
          </Row>
        </rea>
      ))}
    </InfiniteScroll>
  );

  const gameLayout = (
    <InfiniteScroll
      dataLength={data.results.length}
      next={() => fetchMoreData(data, setData)}
      hasMore={!!data.next}
      loader={<Loader spinner text="Loading, please wait" />}
    >
      {data.results.map((data, index) => (
        <>
          <Row key={index}>
            <Col xs={8}>{data?.name}</Col>
          </Row>
          <Row>
            <Col xs={12}>
              <img
                className={style.Image}
                src={data.background_image ? data.background_image : null}
              />
            </Col>
          </Row>
        </>
      ))}
    </InfiniteScroll>
  );

  return (
    <>
      <Container
        className={`${
          isDarkMode
            ? appStyle.BackgroundContainerTest
            : appStyle.BackgroundContainerSmallRed
        }`}
      >
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="title">
                <p>Search for Game</p>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
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
              className={`${
                isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
              } ${appStyle.ButtonLarge}`}
              onClick={() => {
                setSearchDB("Movie");
              }}
            >
              Movies
            </button>
          </Col>
          <Col>
            <button
              className={`${
                isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
              } ${appStyle.ButtonLarge}`}
              onClick={() => {
                setSearchDB("Game");
              }}
            >
              Games
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <button
              className={`${
                isDarkMode ? appStyle.ButtonTest : appStyle.ButtonRed
              } ${appStyle.ButtonLarge}`}
              onClick={getData}
            >
              Search
            </button>
          </Col>
        </Row>
      </Container>
      <Container>
        {hasLoaded ? (
          <>{searchDB === "Movie" ? movieLayout : gameLayout}</>
        ) : (
          <Loader text="Search to get list" />
        )}
      </Container>
    </>
  );
};

export default TestExternalDBAPI;
