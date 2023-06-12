import axios from 'axios'
import jwtDecode from 'jwt-decode'

export const loginUser = (data) => {
    return axios.post(`${process.env.REACT_APP_API_URL}/login`, data)
    .then(function(response){
        localStorage.setItem('token', response.data)
        var token = jwtDecode(response.data);
        localStorage.setItem('role', token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        localStorage.setItem('image', token["Image"]);

        var isVerified = token["IsVerified"];
        localStorage.setItem('isVerified', isVerified !== '1' ? false : true);
    })
}

export const googleLogin = (data) => {
    return axios.post(`${process.env.REACT_APP_API_URL}/googlelogin`, data)
    .then(function(response){
        localStorage.setItem('token', response.data)
        var token = jwtDecode(response.data);
        localStorage.setItem('role', token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
        localStorage.setItem('image', token["Image"]);

        var isVerified = token["IsVerified"];
        localStorage.setItem('isVerified', isVerified !== '1' ? false : true);
    })
}

export const RegisterUser = (data) => {
    return axios.post(`${process.env.REACT_APP_API_URL}/register`, data);
}

export const getCurrentUser = () => {
    return localStorage.getItem('token');
}

export const getUserRole = () => {
    return localStorage.getItem('role');
}

export const getImage = () => {
    return localStorage.getItem('image');
}

export const isVerified = () => {
    return localStorage.getItem('isVerified');
}

export const logout = () => {
    localStorage.clear();
}