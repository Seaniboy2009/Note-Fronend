import axios from "axios";
import jwt_decode from "jwt-decode";

const baseURL = "https://note-backend-api-19a13319c6ea.herokuapp.com";

// Used for testing
// const urls = {
// 	Main: 'https://note-backend-api-19a13319c6ea.herokuapp.com',
// 	dev: 'http://127.0.0.1:8000',
// }

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const axiosMoviesDatabase = axios.create({
  baseURL: "https://moviesdatabase.p.rapidapi.com/titles/search/title/",
  timeout: 5000,
  headers: {
    "X-RapidAPI-Key": "2c53ff4e4fmshe49848acaec3f07p1e278ajsn6f3e8b171bbf", // Replace with your RapidAPI key
    "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosMoviesDatabase.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.error("Error in Movies Database API:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log("Token errors", error.response);

    if (typeof error.response === "undefined") {
      console.log("API still booting");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "api/token/refresh/"
    ) {
      console.log("401 error redirect to login page");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const dataRef = jwt_decode(localStorage.getItem("refresh_token"));

        const now = Math.ceil(Date.now() / 1000);
        console.log(refreshToken);
        console.log(dataRef);
        console.log(dataRef.exp);
        console.log(now);

        if (dataRef.exp > now) {
          return axiosInstance
            .post("api/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);

              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosMoviesDatabase };
