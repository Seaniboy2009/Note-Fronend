import { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import axiosInstance from '../api/axiosDefaults';
    
const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [user, setUser] = useState(() => localStorage.getItem('access_token') ? jwt_decode(localStorage.getItem('access_token')) : null)
    const [signInErrors, setSignInErrors] = useState('')

    const handleLogIn = async (event) => {

        event.preventDefault();

        try {
            await axiosInstance.post('api/token/', {
                username: formData.username,
                password: formData.password,
            }).then((res) => {
                localStorage.setItem('access_token', res.data.access)
                localStorage.setItem('refresh_token', res.data.refresh)
                axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token')
                const data = jwt_decode(res.data.access)
                setUser(data.name.toString())
                window.location.reload()
                navigate('/')
            })
        } catch (error) {
            setSignInErrors(error?.response.data.detail)
            console.log(error?.response.data.detail)
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    const handleLogOut = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload()
        navigate('/')
    }

    let contextData = {
        user:user,
        signInErrors:signInErrors,
        handleLogIn:handleLogIn,
        handleLogOut:handleLogOut,
        handleChange:handleChange,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}