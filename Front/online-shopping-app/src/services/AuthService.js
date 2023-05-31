import axios from 'axios'
import jwtDecode from 'jwt-decode'

export const LoginUser = (data) => {
    return axios.post(`https://localhost:7066/login`, data)
    .then(function(response){
        localStorage.setItem('token', response.data)
        console.log(jwtDecode(response.data));
    })
}

export const RegisterUser = (data) => {
    return axios.post(`https://localhost:7066/register`, data);
}

export const getCurrentUser = () => {
    return localStorage.getItem('token');
}

export const logout = () => {
    localStorage.removeItem('token');
}