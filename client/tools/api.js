import axios from 'axios';
import { getToken, logout } from "./auth";

//192.168.11.6
//localhost
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const api = axios.create({
    //baseURL: `http://localhost:3333`
    baseURL: 'https://qgda30.herokuapp.com',
    // headers: {
    //   'Access-Control-Allow-Origin': 'https://qgda30.herokuapp.com',
    //   'Content-Type': 'application/json',
    // },
});




api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(function (response) {

  const authErrorTypes = [
    "No token providen",
    "Token error",
    "Token malformated",
    "Invalid token",
  ]

  if((response.data && response.data.error) && authErrorTypes.includes(response.data.error)){
    logout()
    window.location.assign("https://qgda30.herokuapp.com/app/login");
    console.log('sla')
  }
  
  return response;
}, function (error) {

  return Promise.reject(error);
});

export default api;