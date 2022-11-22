import { useState, useEffect, useContext } from "react";
import { getUser } from "../services/users";
import { validator } from "../services/validator";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeRoomAccess, sendMessage, getMessages } from "../services/chat";

import SocketContext from "../contexts/socketContext";

const Message = ({message}) => {
	const [user1, setUser1] = useState(0);
	getUser({target: 'self'}).then(response => {
		setUser1(response.data.id)
	})
	if (message.sender === user1) {
		return (
			<div className="d-flex">
				<div style={{width : "20%"}}></div>
				<div className="card bg-dark p-2 text-light" style={{width : "80%"}}>{message.body}</div>
				<small>time</small>
			</div>
		)
	} else {
		return (
			<div className="d-flex">
				<div className="card bg-light p-2 text-dark" style={{width : "80%"}}>{message.body}</div>
				<div style={{width : "20%"}}></div>
			</div>
		)
	}
}

const Chat = ({props}) => {
	const socket = props.socket;


	const [message, setMessage] = useState([]);
	useEffect(() => {
		socket.on('receive_message', (data) => {
			console.log(data);
			// let temp = [...message];
			// temp.push(data);
			setMessage(data)
			console.log('socket messages:', message.body);
		})
	}, [socket])
	if (message.length > 0) {
		return (
			<>
				{message.map((message, i) => {
					return <Message key={i} message={message}/>
				})}
			</>
		)
	}
}

export const ChatRoom = () => {
	const navigate = useNavigate();

	const [inputMessage, setInputMessage] = useState('')
	const room = useParams().roomId;
	const [user1, setUser1] = useState(0);
	const socket = useContext(SocketContext);
	const [messages, setMessages] = useState([]);
	
	useEffect(() => {
		getMessages({room : room}).then(response => {
			console.log('chatroom', response.data)
			setMessages(response.data);
		})
	}, [])
	
	useEffect(() => {
		socket.emit('join_room', room);
		getUser({target: 'self'}).then(response => {
			setUser1(response.data.id)
		})

		validator().then((response) => {
			if (response.data === 'token invalid')
				navigate('/')
			else if (response.data === 'valid') {
				// setLogin(true);
				getUser({target: 'self'}).then(response => {
					authorizeRoomAccess({room : room}).then(response => {
						if (response.data === 'forbid')
							navigate('/messages');
					})
				})
			}
		})
	}, []);
	
	

	const handleSubmit = async (event) => {
		event.preventDefault();
		const message = {
			room: room,
			body: inputMessage,
			sender: user1,
			time: new Date().getHours() + ':' + new Date().getMinutes()
		}
		await sendMessage(message).then(response => {
			setInputMessage('')
		})
		await socket.emit('send_message', message);

	} 
		return (
			<>
				{messages.map((message, i) => {
					return <Message key={i} message={message}/>
				})}
				<Chat props={{socket, room}} />
				<div className="container" >
				</div>
				<form style={{bottom : '0'}} className="form-inline" onSubmit={(e) => handleSubmit(e)}>
					<input placeholder="Message..." type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)}></input>
					<button type="submit" className="btn btn-dark ml-2" >{'>>'}</button>
				</form>
			</>
		)
}
