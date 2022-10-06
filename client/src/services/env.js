import axios from 'axios'
const baseUrl = '/api/env'

export const geoApiKey = () => {
	return axios.post(`${baseUrl}/geoapikey`);
}