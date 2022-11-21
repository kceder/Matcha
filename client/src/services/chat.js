import axios from 'axios'
const baseUrl = '/api/chat'

export const getChatRooms = () => {
	return axios.post(`${baseUrl}/chatrooms`);
}

export const authorizeRoomAccess = (newObject) => {
	return axios.post(`${baseUrl}/authorize`, newObject, {withCredentials: true})
}


export const getMessages = (newObject) => {
	return axios.post(`${baseUrl}/get-messages`, newObject, {withCredentials: true})
}

export const sendMessage = (newObject) => {
	return axios.post(`${baseUrl}/send`, newObject, {withCredentials: true})
}