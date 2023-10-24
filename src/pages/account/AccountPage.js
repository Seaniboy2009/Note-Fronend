import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { Container } from 'react-bootstrap'
import appStyle from '../../styles/App.module.css'

const AccountPage = () => {
    
    let {user} = useContext(AuthContext)

  return (
    <Container className={`text-center ${appStyle.Container}`}>
        <h2>Account Page</h2>
        <h3>Name: {user.name}</h3>
        {console.log(user)}
    </Container>
  )
}

export default AccountPage