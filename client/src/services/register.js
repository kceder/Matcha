import axios from 'axios';
const baseUrl = '/api/';


export const createUser = (newObject) => {
	return axios.post(`${baseUrl}register`, newObject);
}

export const setUpUser = (newObject) => {
	return axios.post(`${baseUrl}set-up-user`, newObject);
}