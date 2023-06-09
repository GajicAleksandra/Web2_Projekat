import axios from 'axios';

export const getProducts = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getproducts`, config);
}

export const addProduct = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.post(`${process.env.REACT_APP_API_URL}/addproduct`, data, config);
}

export const getProduct = (id) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getproduct/${id}`, config);
}

export const editProduct = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`${process.env.REACT_APP_API_URL}/editproduct`, data, config);
}