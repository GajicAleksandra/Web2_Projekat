import axios from 'axios';

export const GetLoggedInUser = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getloggedinuser`, config);
}

export const ChangeProfile = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`${process.env.REACT_APP_API_URL}/changeprofile`, data, config);
}

export const getAllSalesmen = (status) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getsalesmen/${status}`, config)
}

export const acceptOrRejectSalesman = (action, email) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`${process.env.REACT_APP_API_URL}/acceptorrejectsalesman`, 
    {
        action: action, 
        email: email
    },
    config);
}

export const getSalesmanStatus = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getsalesmanstatus`, config);
}

export const changePassword = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`${process.env.REACT_APP_API_URL}/changepassword`, data, config);
}

export const getUsers = (type) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`${process.env.REACT_APP_API_URL}/getusers/${type}`, config);
}