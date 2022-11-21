import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { validator } from "../services/validator";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeRoomAccess, sendMessage, getMessages } from "../services/chat";


const Message = ({message, currentUser}) => {

	if (message.sender === currentUser) {
		return (
			<div className="d-flex">
				<div style={{width : "20%"}}></div>
				<div className="card bg-dark p-2 text-light" style={{width : "80%"}}>{message.body}</div>
				<small>{message.time}</small>
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

export const ChatRoom = () => {
	const navigate = useNavigate();
	const [user1, setUser1] = useState(0);

	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('')
	const room = useParams().roomId;

	useEffect(() => {
		validator().then((response) => {
			if (response.data === 'token invalid')
				navigate('/')
			else if (response.data === 'valid') {
				// setLogin(true);
				getUser({target: 'self'}).then(response => {
					setUser1(response.data.id)
					authorizeRoomAccess({room : room}).then(response => {

						if (response.data === 'forbid')
							navigate('/messages');
					})
				})
			}
		})
	}, [messages]);
	useEffect(() => {
		getMessages({room : room}).then(response => {
			const message = response.data.map(message => <Message key={message.id} message={message} currentUser={user1}/>);
			console.log(message);
			setMessages(message)
		})
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault();
		setMessages([...messages, <Message key={messages.length + 1} message={{sender : user1, body : inputMessage}} currentUser={user1}/>]);
		const message = {
			room: room,
			message: inputMessage,
		}
		sendMessage(message).then(response => {
			console.log(response.data)
			setInputMessage('')
		})
	} 
	if (messages.length > 0) {

		return (
			<>
				<div className="container" >
					{messages}
				</div>
				<form style={{bottom : '0'}} className="form-inline" onSubmit={(e) => handleSubmit(e)}>
					<input placeholder="Message..." type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)}></input>
					<button type="submit" className="btn btn-dark ml-2" >{'>>'}</button>
				</form>
			</>
		)
	}
	
}
