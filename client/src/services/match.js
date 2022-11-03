import axios from 'axios';
const baseUrl = '/api/match';

export const likeDislike = (newObject) => {
	return axios.post(baseUrl, newObject, { withCredentials: true});
}
