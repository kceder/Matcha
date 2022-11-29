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

export const filterUsers = (object) => {
	return axios.post(`${baseUrl}/filter`, object);
}

export const getLoggedInUsers = () => {
	return axios.post(`${baseUrl}/getLoggedInUsers`);
}

export const checkActiStat = (object) => {
	return axios.post(`${baseUrl}/check-acti-stat`, object);
}