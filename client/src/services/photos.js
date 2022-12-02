import axios from 'axios';
const baseUrl = '/api/photos';

export const getUserPhotos = (newObject) => {
	return axios.post(`${baseUrl}/user`, newObject, { withCredentials: true});
}

export const setProfilePicture = (newObject) => {
	return axios.post(`${baseUrl}/profile`, newObject, { withCredentials: true});
}

export const addPicture = (newObject) => {
	return axios.post(`${baseUrl}`, newObject, { withCredentials: true});
}