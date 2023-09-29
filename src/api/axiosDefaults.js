import axios from "axios";

axios.defaults.baseURL = 'https://note-backend-api-19a13319c6ea.herokuapp.com';
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// axios.defaults.withCredentials = true;
