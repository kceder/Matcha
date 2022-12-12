import React, { useEffect, useState } from "react";
import { validator } from "../services/validator";
import { useNavigate } from "react-router-dom";
import {getChatRooms} from '../services/chat'
import { ChatLinks } from "../components/ChatLinks";
import {getUser} from "../services/users"

export const ChatPage = () => {

	const [currentUser, setCurrentUser] = useState(0)
	const [chatRooms, setChatRooms] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		validator().then((response) => {
			if (response.data === 'token invalid' || response.data === 'no token')
				navigate('/')
			else if (response.data === 'valid') {
				getUser({target: 'self'}).then(response => {
					setCurrentUser(response.data.id);
					getChatRooms().then((response) => {
						if (response.data.length > 0){
							setChatRooms(response.data)
						}
					})
				})
			}
		})
	}, [navigate]);
	
	if (currentUser === 0 && chatRooms.length === 0) {
		return <>loading</>
	} else {
		return (
			<div>
				<ChatLinks props={{chatRooms, currentUser}}/>
			</div>
		)
	}
};