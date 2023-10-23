import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import axiosInstance from '../api/axiosDefaults'

const RegisterPage = () => {

    const [formData, setFormData] = useState({
        username: '',
        password1: '',
        password2: '',
    })

    const { username, password1, password2 } = formData

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        })
        console.log(formData)
        console.log({username, password1, password2})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData  = new FormData()
        formData.append('username', username)
        formData.append('password1', password1)
        formData.append('password2', password2)

        try {
            await axiosInstance.post('/dj-rest-auth/registration/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
        } catch (error) {
            console.log(error.response.request.responseText)
        }

    }


  return (
    <Container>
        <form onSubmit={handleSubmit}>
            <input type='text' name='username' onChange={handleChange} placeholder="Enter Username" />
            <input type='password' name='password1' onChange={handleChange} placeholder="Enter Password" />
            <input type='password' name='password2' onChange={handleChange} placeholder="Confirm Password" />
            <button type='submit'>Submit</button>
        </form>
    </Container>
  )
}

export default RegisterPage