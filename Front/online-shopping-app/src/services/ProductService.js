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