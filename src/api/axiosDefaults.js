import axios from "axios";
import jwt_decode from "jwt-decode";

const baseURL = 'https://note-backend-api-19a13319c6ea.herokuapp.com'

// Used for testing
const urls = {
	Main: 'https://note-backend-api-19a13319c6ea.herokuapp.com',
	dev: 'http://127.0.0.1:8000',
}

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: localStorage.getItem('access_token') 
        ? "Bearer " + localStorage.getItem('access_token') 
        : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    }
})

const axiosMoviesDatabase = axios.create({
    baseURL: 'https://moviesdatabase.p.rapidapi.com/titles/search/title/',
    timeout: 5000,
    headers: {
        'X-RapidAPI-Key': '2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf', // Replace with your RapidAPI key
        'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
        'Content-Type': 'application/json',
        accept: 'application/json',
    }
})

axiosMoviesDatabase.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        // Your error handling for the Movies Database API
        console.error('Error in Movies Database API:', error);
        return Promise.reject(error);
    }
)

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		// console.log('Axios interceptors called: axiosdefaults.js: line 23')
		const originalRequest = error.config;
		console.log('Token errors', error.response)

		if (typeof error.response === 'undefined') {
			// alert(
			// 	'A server/network error occurred. ' +
			// 		'Looks like CORS might be the problem. ' +
			// 		'Sorry about this - we will get it fixed shortly.'
			// )

			console.log('API still booting')
			// Reload the page after 5 seconds
			setTimeout(() => {window.location.reload()}, 5000)
			return Promise.reject(error)
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'api/token/refresh/'
		) {
			// 401 not authorised redirect to home page and no refresh token
			console.log('401 error redirect to login page')
			window.location.href = '/'
			return Promise.reject(error)
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			// console.log('401 error and token not valid get new token')
			const refreshToken = localStorage.getItem('refresh_token')

			if (refreshToken) {
				// const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))
				// const tokenParts = refreshToken.split('.')[1]
				const dataRef = jwt_decode(localStorage.getItem('refresh_token'))

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(refreshToken);
				console.log(dataRef);
				console.log(dataRef.exp);
				console.log(now);


				if (dataRef.exp > now) {
					// console.log('Refresh token not expired', tokenParts, now)
					return axiosInstance
						.post('api/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							// console.log('new tokens assigned')
							// console.log('new access token', response.data.access)
							// console.log('new refresh token', response.data.refresh)
							localStorage.setItem('access_token', response.data.access);
							// localStorage.setItem('refresh_token', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'Bearer ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'Bearer ' + response.data.access;

							return axiosInstance(originalRequest)
						})
						.catch((err) => {
							console.log(err)
						})
				} else {
					// console.log('Refresh token is expired', tokenParts, now)
					localStorage.removeItem('access_token')
					localStorage.removeItem('refresh_token')
					window.location.href = '/'
				}
			} else {
				// console.log('Refresh token not available.')
				window.location.href = '/'
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
)

export {
    axiosInstance,
    axiosMoviesDatabase,
}
