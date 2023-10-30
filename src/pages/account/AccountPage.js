import React, { useContext } from 'react'
import AuthContext from '../../contexts/AuthContext'
import { Container } from 'react-bootstrap'
import appStyle from '../../styles/App.module.css'

const AccountPage = () => {
    
    let {user, expire} = useContext(AuthContext)

  return (
    <Container className={`text-center ${appStyle.Container}`}>
        <h2>Account Page</h2>
        <h3>Name: {user.name}</h3>
        <h3>Login expires: {expire}</h3>
        {console.log(user)}
        {console.log(expire)}
    </Container>
  )
}

export default AccountPage