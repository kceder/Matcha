import axios from 'axios';
const baseUrl = '/api/match';

export const likeDislike = (newObject) => {
	return axios.post(`${baseUrl}/match`, newObject, { withCredentials: true});
}

export const fetchMatch = (newObject) => {
	return axios.post(`${baseUrl}/fetchMatch`, newObject, { withCredentials: true});
}

export const unlike = (newObject) => {
	return axios.post(`${baseUrl}/unlike`, newObject, { withCredentials: true});
}