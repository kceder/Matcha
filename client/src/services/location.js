import axios from 'axios';
const baseUrl = '/api/location/update';

export const updateLocation = (location) => {
	return axios.post(baseUrl, location, { withCredentials: true});
}
