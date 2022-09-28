import axios from 'axios';
const baseUrl = '/api/login';

export const loginUser = (newObject) => {
	return axios.post(baseUrl, newObject, { withCredentials: true});
}
