import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {getLastMessage} from '../services/chat'
import { getUser } from "../services/users";
import {getUserPhotos} from "../services/photos"
import SocketContext from '../contexts/socketContext'
import { getLoggedInUsers } from "../services/users";
import { Spinner } from "react-bootstrap";

const LoginStatus = ({user}) => {
	const socket = useContext(SocketContext);
	const [login, setLogin] = useState(false);
	useEffect(() => {
		getLoggedInUsers().then(response => {
			const users = response.data;
			if (users.length > 0) {
				if (users.includes(user))
					setLogin(true)
				else
					setLogin(false)
			}
		})
	}, [user])
	useEffect(() => {
		socket.on("logged", (data) => {
			if (data.includes(user))
				setLogin(true)
			else
				setLogin(false)
		});
	}, [socket, user])

	if (login) {
		return (
				<Spinner style={{textAlign: 'center', width: "0.8rem", height: "0.8rem" }} animation="grow" role="status"></Spinner>
		)
	} else {
		return (
				<i style={{textAlign: 'center', width: "0.5rem", height: "0.5rem",  color: 'gray'}} className="fa-regular fa-circle-xmark"></i>
		)
	}
}

const ChatLink = ({user, room}) => {

	const [username, setUsername] = useState('');
	const [userPicture, setUserPicture] = useState('');
	const Navigate = useNavigate();
	const [lastMessage, setLastMessage] = useState('');
	const [mouseOver, setMouseOver] = useState(false);

	useEffect(() => {
		getUser({target : user}).then(response => {
			setUsername(`${response.data.basicInfo.name} ${response.data.basicInfo.lastName}`);
			getUserPhotos({target: user}).then(response => {
				setUserPicture(response.data.pic_1)
			})
		})
		getLastMessage({room: room}).then(response => {
			if (response.data.seen === 0) {
				setLastMessage(<small className="text-muted" style={{fontWeight : 'bold'}}>{response.data.content}</small>)
			} else {
				setLastMessage(<small className="text-muted">{response.data.content}</small>)
			}
		})
	}, [ user, room])

	const handleClick = (room) => {
		Navigate(`/direct/${room}`)
	}
	return (
		<>
			<div style={mouseOver === true ? { background : 'rgb(247, 247, 247)' } : null} className="row" onClick={() => handleClick(room)} onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
				<img className="col-3" src={userPicture} style={{maxWidth : '100px'}} alt="profile"/>
				<div className="col-9">
					<div className="row">
						<div className="col-1">
							<LoginStatus user={user} />
						</div>
						<div className="col">
							<p>{username}</p>
						</div>
					</div>
					{lastMessage}
				</div>
				
			</div>
			<hr className="mt-3"></hr>
		</>
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
	if (chats.length > 0) {
		return (
			<div className="container mt-3">
			{chats}
		</div>
		)
	} else {
		return (
			<div className="container mt-3">
				<h6 style={{textAlign: 'center' ,color: 'gray', marginTop : '5rem'}}>No matches to chat with yet!</h6>
			</div>
		)
	}
	
}; 