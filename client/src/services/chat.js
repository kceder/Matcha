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

export const checkForUnreadMessages = () => {
	return axios.post(`${baseUrl}/check-read-messages`, {withCredentials: true})
}

export const setMessagesToSeen = (newObject) => {
	return axios.post(`${baseUrl}/set-messages-to-seen`, newObject ,{withCredentials: true})
}

export const getLastMessage = (newObject) => {
	return axios.post(`${baseUrl}/get-last-message`, newObject, {withCredentials: true})
}