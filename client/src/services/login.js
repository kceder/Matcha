import axios from 'axios';
const baseUrl = 'http://localhost:5000/api/login';

export const loginUser = (newObject) => {
	return axios.post(baseUrl, newObject);
}
