import React from 'react'
import Spinner from "react-bootstrap/Spinner";

const Loader = ({spinner, text}) => {
  return (
    <div>
        {text ? <h4>{text}</h4> : null}
        {spinner ? <Spinner animation="border" /> : null}
    </div>
  )
}

export default Loader