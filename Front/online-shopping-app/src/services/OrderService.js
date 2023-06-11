import axios from 'axios';

export const placeOrder = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.post(`${process.env.REACT_APP_API_URL}/placeorder`, data, config);
}

export const getOrders = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getallorders`, config);
}

export const getSalesmanOrders = (type) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getsalesmanorders/${type}`, config);
};

export const getCustomerOrders = (type) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getcustomerorders/${type}`, config);
};

export const cancelOrder = (id) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/cancelorder/${id}`, config);
};