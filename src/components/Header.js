import React, { useState, useEffect } from 'react'
import style from '../styles/Header.module.css'
import appStyle from '../styles/App.module.css'
import { Link } from 'react-router-dom';
import { APIURL } from '../api/APIURL';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Header = () => {
  const [online, setOnline] = useState(false)
  const [count, setCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)

  const [theme, setTheme] = useState(style.ThemeRed)

  useEffect(() => {
    const checkServer = async () => {
      console.log('Check server called')
      const response = await fetch(`${APIURL}/api/notes/`)
      const data = await response.json()
      console.log(response)
      if (response.status === 200) {
        setOnline(true)
        setNoteCount(data.length)

      } else {
        setOnline(false)

      }
    }

    const checkCount = () => setCount(prevCount => prevCount + 1)

    const timer = setTimeout(() => {
      checkServer()
    }, 1000);

    const interval = setInterval(checkServer, 600000);
    const count = setInterval(checkCount, 60000);

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      clearInterval(count)
    }
  }, [])

  const changeTheme = () => {
    const themeHolder = document.getElementById('theme')
    const themeHolder2 = document.getElementById('theme2')

    console.log(themeHolder)
    console.log(themeHolder2)

    if (theme == style.ThemeRed) {
      console.log(themeHolder)
      setTheme(style.ThemePurple)
    } else {
      setTheme(style.ThemeRed)
    }
  }

  const connectedText = (
    <h4 className={style.ServerConnected}>Connected: <i className="fa-solid fa-dice-d20"></i></h4>
  )

  const notConnectedText = (
    <h4 className={style.ServerNotConnected}>Not Connected: <i className="fa-solid fa-dice-d20"></i></h4>
  )

  const minute = () => {
    if(count == 1) {
      return 'minute'
    } else {
      return 'minutes'
    }
  }


  return (
    <Container id='theme2' fluid className={`${style.Header} ${style.FixedTop} ${theme}`}>
      <Row className="justify-content-md-center">
        <Link className={style.Link} to={'/'}>Home</Link>
        <Link className={style.Link} to={'notes/'}>Notes</Link>
        <Link className={style.Link} to={'lists/'}>Lists</Link>
        {/* <button onClick={changeTheme} className={appStyle.Button}>Change Theme</button> */}
        {/* <p>Connected for: {count} {minute()}</p> */}
        {/* <p>Notes: {noteCount}</p> */}
        {online ? (
          <>
            {connectedText}
          </>
          ) : (
            <>
            {notConnectedText}
            </>
          )}
      </Row>
    </Container>

  )
}

export default Header