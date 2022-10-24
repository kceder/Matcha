import axios from 'axios'
const baseUrl = '/api/env'

export const geoApiKey = () => {
	return axios.post(`${baseUrl}/geoapikey`);
}

export const reverseGeoApiKey = () => {
	return axios.post(`${baseUrl}/reversegeoapikey`);
}