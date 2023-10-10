import axios from "axios";
import jwtDecode from "jwt-decode";
import jwt_decode from "jwt-decode";

const baseURL = 'https://note-backend-api-19a13319c6ea.herokuapp.com'
const DEVbaseURL = 'http://127.0.0.1:8000'

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

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		console.log('Axios interceptors called: axiosdefaults.js: line 23')
		const originalRequest = error.config;

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			)
			return Promise.reject(error)
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'api/token/refresh/'
		) {
			console.log('401 error redirect to login page')
			window.location.href = '/'
			return Promise.reject(error)
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			console.log('401 error and token not valid get new token')
			const refreshToken = localStorage.getItem('refresh_token')

			if (refreshToken) {
				// const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))
				const tokenParts = refreshToken.split('.')[1]
				const dataRef = jwt_decode(localStorage.getItem('refresh_token'))

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(refreshToken);
				console.log(dataRef);
				console.log(dataRef.exp);
				console.log(now);


				if (dataRef.exp > now) {
					console.log('Refresh token not expired', tokenParts, now)
					return axiosInstance
						.post('api/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							console.log('new tokens assigned')
							console.log('new access token', response.data.access)
							console.log('new refresh token', response.data.refresh)
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
					console.log('Refresh token is expired', tokenParts, now)
					alert(
						'Refresh token is expired.'
					)
					// window.location.href = '/'
				}
			} else {
				console.log('Refresh token not available.')
				alert(
					'Refresh token not available.'
				)
				// window.location.href = '/'
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
)

export default axiosInstance
