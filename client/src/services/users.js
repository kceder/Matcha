import axios from 'axios';
const baseUrl = '/api/users';

export const getAllUsers = () => {
	return axios.get(baseUrl);
}

export const activateUser = (token) => {
	return axios.post(`${baseUrl}/activate`, token);
}
