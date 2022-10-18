import axios from 'axios';
const baseUrl = '/api/location/';

export const updateGpsLocation = (location) => {
	return axios.post(`${baseUrl}gps`, location, { withCredentials: true});
}

export const updateIpLocation = (location) => {
	return axios.post(`${baseUrl}ip`, location, { withCredentials: true});
}
