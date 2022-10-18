import axios from 'axios';
const baseUrl = '/api/users';

export const getAllUsers = () => {
	return axios.get(baseUrl);
}

export const getUser = (object) => {
	return axios.post(`${baseUrl}/getUser`, object);
}

export const activateUser = (token) => {
	return axios.post(`${baseUrl}/activate`, token);
}
