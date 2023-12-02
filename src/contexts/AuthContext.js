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

    const [expire, setExpire] = useState(() => {
        if (localStorage.getItem('refresh_token')) {
          const dataRef = jwt_decode(localStorage.getItem('refresh_token'));
          const expire = new Date(dataRef.exp * 1000).toDateString();
          return expire;
        } else {
          return ''; // Provide a default value if 'refresh_token' doesn't exist
        }
    });
    const [signInErrors, setSignInErrors] = useState('')

    // Handle the log of the user by passing the API the username and password
    // This will then store the returned access and refresh tokens and the users name
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
            setSignInErrors(error?.response?.data?.detail)
            console.log(error?.response?.data?.detail)
        }
    }

    // Handle change of the users username and password for signing in
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })
    }

    // Handle the logout of the user, it will delete the JWT tokens form the local storage
    const handleLogOut = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload()
        navigate('/')
    }

    // This is the data and fucntions passed down so they can be accessed within the app
    let contextData = {
        user:user,
        expire:expire,
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