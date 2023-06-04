import axios from 'axios'
import jwtDecode from 'jwt-decode'

export const LoginUser = (data) => {
    return axios.post(`https://localhost:7066/login`, data)
    .then(function(response){
        localStorage.setItem('token', response.data)
        var token = jwtDecode(response.data);
        localStorage.setItem('role', token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    })
}

export const RegisterUser = (data) => {
    return axios.post(`https://localhost:7066/register`, data);
}

export const getCurrentUser = () => {
    return localStorage.getItem('token');
}

export const getUserRole = () => {
    return localStorage.getItem('role');
}

export const logout = () => {
    localStorage.removeItem('token');
}