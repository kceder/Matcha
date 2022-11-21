import axios from 'axios'
const baseUrl = '/api/chat'

export const getChatRooms = () => {
	return axios.post(`${baseUrl}/chatrooms`);
}
