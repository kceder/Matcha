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
			<img className="col-3" src={userPicture} style={{maxWidth : '100px'}} />
			<div className="col-9">
				<p>{username}</p>
				<small className="text-muted">last message</small>
			</div>
			<hr className="mt-3"></hr>
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
		<div className="container mt-3">
			{chats}
		</div>
	)
	
}; 