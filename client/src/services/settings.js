import axios from 'axios';
const baseUrl = '/api/settings/';


export const changePassword = (newObject) => {
	return axios.post(`${baseUrl}password`, newObject);
}

export const changeUserInfo = (newObject) => {
	return axios.post(`${baseUrl}changeUserInfo`, newObject);
}

export const sendRestore = (email) => {
	return axios.post(`${baseUrl}restorePassword`, email);
}

export const passwordRestore = (newObject) => {
	return axios.post(`${baseUrl}passwordRestore`, newObject);
}
