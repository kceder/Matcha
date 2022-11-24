import axios from 'axios';
const baseUrl = '/api/stats/';


export const getStats = (target) => {
	return axios.post(`${baseUrl}get-stats`, target ,{ withCredentials: true});
}

export const updateViewStats = (data) => {
	return axios.post(`${baseUrl}view`, data,{ withCredentials: true});
}

export const updateLikeStats = (data) => {
	return axios.post(`${baseUrl}like`, data,{ withCredentials: true});
}

export const updateMatchStats = (data) => {
	return axios.post(`${baseUrl}match`, data,{ withCredentials: true});
}

export const updateBlockStats = (data) => {
	return axios.post(`${baseUrl}block`, data,{ withCredentials: true});
}