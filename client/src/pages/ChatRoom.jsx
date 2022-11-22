import { useState, useEffect, useContext } from "react";
import { getUser } from "../services/users";
import { validator } from "../services/validator";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeRoomAccess, sendMessage, getMessages } from "../services/chat";

import SocketContext from "../contexts/socketContext";
import LoginContext from "../contexts/loginContext";
import { Badge } from "react-bootstrap";

const Message = ({message}) => {
	const [user1, setUser1] = useState(0);
	getUser({target: 'self'}).then(response => {
		setUser1(response.data.id)

	})
	if (message.sender === user1) {
		return (
			<div className="d-flex" style={{padding: '1rem'}}>
				<div style={{width : "20%"}}></div>
				<div style={{fontSize : '0.6rem', color : "darkgray", marginRight : "10px"}}>time</div>
				<Badge bg="light" text="dark" style={{minWidth: "80%", maxWidth : "80%", padding : '10px', textAlign : 'end', marginRight : '10px'}}>{message.body}</Badge>
			</div>
		)
	} else {
		return (
			<div className="d-flex" style={{padding: '1rem'}}>
				<Badge bg="secondary" style={{minWidth: "80%", maxWidth : "80%", padding : '10px', textAlign : 'start', marginLeft : '10px'}}>{message.body}</Badge>
				<div style={{fontSize : '0.6rem', color : "darkgray", marginLeft : "10px"}}>time</div>
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
			
			setMessage((prev) => [...prev, data]);
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
	const [user2, setUser2] = useState(0);
	const socket = useContext(SocketContext);
	const [messages, setMessages] = useState([]);
	const [login, setLogin] = useContext(LoginContext);
	const [User2Name, setUser2Name] = useState('');

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
				setLogin(true);
				getUser({target: 'self'}).then(response => {
					authorizeRoomAccess({room : room}).then(response => {
						if (response.data === 'forbid')
							navigate('/messages');
						else if (response.data.message === 'authorize')
							setUser2(response.data.user2);
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
			receiver: user2,
			time: new Date().getHours() + ':' + new Date().getMinutes()
		}
		await sendMessage(message).then(response => {
			setInputMessage('')
		})
		await socket.emit('send_message', message);

	}

	useEffect(() => {
		getUser({target: user2}).then(response => {
			let temp = response.data.basicInfo.username
			console.log(response.data.basicInfo);
			setUser2Name(temp);
		})
	},[user2])
	
		return (
			<>
				<div className="container" style={{marginBottom: 'revert', marginTop: 'revert', padding: 25, maxWidth: 550}}>
				<div className="header" style={{marginBottom: '1rem'}}>
				<i class="fa-regular fa-user"></i><h3>{User2Name}</h3>
				</div>
				<div className="" style={{height: '65vh', overflowY: 'scroll', marginBottom: 'revert', marginTop: 'revert', padding: 25, maxWidth: 550, borderStyle : 'solid', borderWidth : '1px', borderColor : 'lightgray', backgroundColor : 'lightgray'}}>
				{messages.map((message, i) => {
					return <Message key={i} message={message}/>
				})}
				<Chat props={{socket, room}} />
				</div>
				<div className="" style={{ marginBottom: 'revert', padding: 25, maxWidth: 550}}>

				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="d-flex align-items-end">
						<input className="form-control" placeholder="Message..." type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} />
						<button className="btn btn-secondary" type="submit" ><i className="fa-regular fa-paper-plane"></i></button>
					</div>
				</form>
				</div>
				</div>
			</>
		)
}
