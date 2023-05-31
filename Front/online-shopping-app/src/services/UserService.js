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