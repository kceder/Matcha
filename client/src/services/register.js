import axios from 'axios';
const baseUrl = 'http://localhost:5000/api/register';


export const createUser = (newObject) => {
	return axios.post(baseUrl, newObject);
}
