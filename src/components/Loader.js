import React from 'react'
import Spinner from "react-bootstrap/Spinner";

// Show a spinner icon and text when loading data
const Loader = ({spinner, text}) => {
  return (
    <div>
        {text ? <h5>{text}</h5> : null}
        {spinner ? <Spinner animation="border" /> : null}
    </div>
  )
}

export default Loader