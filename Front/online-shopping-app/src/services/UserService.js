import axios from 'axios';

export const GetLoggedInUser = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`https://localhost:7066/getloggedinuser`, config);
}

export const ChangeProfile = (data) => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`https://localhost:7066/changeprofile`, data, config);
}

export const getAllSalesmen = () => {
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.get(`https://localhost:7066/getsalesmen`, config)
}

export const acceptOrRejectSalesman = (action, email) => {

    console.log(email);
    const config = {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }
    return axios.put(`https://localhost:7066/acceptorrejectsalesman`, 
    {
        action: action, 
        email: email
    },
    config);
}