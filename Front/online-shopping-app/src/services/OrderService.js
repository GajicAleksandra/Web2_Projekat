import axios from 'axios';

export const placeOrder = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.post(`${process.env.REACT_APP_API_URL}/placeorder`, data, config);
}