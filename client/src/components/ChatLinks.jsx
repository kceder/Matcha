import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import {getChatRooms} from '../services/chat'
import { getUser } from "../services/users";
import {getUserPhotos} from "../services/photos"


const ChatLink = ({user, room}) => {
	console.log(user, room)
	const [username, setUsername] = useState('');
	const [userPicture, setUserPicture] = useState('');

	getUser({target : user}).then(response => {
		console.log(response.data)
		setUsername(`${response.data.basicInfo.name} ${response.data.basicInfo.lastName}`);
		getUserPhotos({target: user}).then(response => {
			console.log(response.data)
			setUserPicture(response.data.pic_1)
		})
	})

	return (
		<div className="row">
			{user} {room} {username} <img src={userPicture} />
		</div>
	)
}

export const ChatLinks = ({props}) => {
	const chats = props.chatRooms.map(room => {
		if (room.user1 === props.currentUser) {
			return (<ChatLink user={room.user2} room={room.id} key={room.id}/>)
		} else {
			return (<ChatLink user={room.user1} room={room.id} key={room.id}/>)
		}
	})
	return (
		<div className="container">
			{chats}
		</div>
	)
	
}; 