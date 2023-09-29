import React, { useState, useEffect } from 'react'
import style from '../styles/Header.module.css'

const Header = () => {
  const [online, setOnline] = useState(false)
  const [count, setCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)

  useEffect(() => {
    const checkServer = async () => {
      console.log('Check server called')
      const response = await fetch('/api/notes/')
      const data = await response.json()
      console.log(response)
      if (response.status === 200) {
        setOnline(true)
        setCount(prevCount => prevCount + 1)
        setNoteCount(data.length)
        document.getElementById('status').className = style.ServerConnected
      } else {
        setOnline(false)
        document.getElementById('status').className = style.ServerNotConnected
      }
    }

    const timer = setTimeout(() => {
      checkServer()
      // checkNoteCount()
    }, 1000);

    const interval = setInterval(checkServer, 60000);

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const connectedText = (
      <p>Connected: <i className="fa-solid fa-dice-d20"></i></p>
  )

  const notConnectedText = (
    <p>Not Connected: <i className="fa-solid fa-dice-d20"></i></p>
  )

  return (
    <div className={style.Header}>
      <p>Home</p>
      <p>Connected for: {count} Minutes</p>
      <p>Notes: {noteCount}</p>
      <p id='status' className={style.ServerNotConnected}> 
      {online ? (
        <>
          {connectedText}
        </>
        ) : (
          <>
          {notConnectedText}
          </>
        )}</p>
    </div>

  )
}

export default Header