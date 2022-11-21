import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import {getChatRooms} from '../services/chat'
import { ChatLinks } from "../components/ChatLinks";
import {getUser} from "../services/users"

export const ChatPage = () => {
	
	const [login, setLogin] = useContext(LoginContext);
	const [currentUser, setCurrentUser] = useState(0)
	const [chatRooms, setChatRooms] = useState([]);
	const [props, setProps] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		validator().then((response) => {
			if (response.data === 'token invalid')
				navigate('/')
			else if (response.data === 'valid') {
				setLogin(true);
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
	}, []);
	
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