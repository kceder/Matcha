import axios from 'axios';
const baseUrl = '/api/tags';

export const getAllTags = () => {
    return axios.get(baseUrl);
}