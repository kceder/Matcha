import { useState, useEffect, useContext, useRef } from "react";
import { getUser } from "../services/users";
import { validator } from "../services/validator";
import { useNavigate, useParams } from "react-router-dom";
import { authorizeRoomAccess, sendMessage, getMessages, setMessagesToSeen } from "../services/chat";

import SocketContext from "../contexts/socketContext";
import LoginContext from "../contexts/loginContext";
import { Badge, Image, Row, Col, Container } from "react-bootstrap";
import { getUserPhotos } from "../services/photos";
import { getLoggedInUsers } from "../services/users";

const ChatFooter = ({props}) => {
	const room = useParams().roomId;
	const [inputMessage, setInputMessage] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (inputMessage.replace(/\s/g, '').length !== 0 && inputMessage.length < 420) {
			const message = {
				room: room,
				body: inputMessage,
				sender: props.user1,
				receiver: props.user2,
				time: new Date(),
				// socket : props.socket.id
			}
			sendMessage(message).then(response => {
				if (response.data === 'error') {
					window.location.reload();
				}
				props.socket.emit('notification', {to : props.user2});
				setInputMessage('')
			})
			props.socket.emit('send_message', message);
		} else {
			props.setMessages((prev) => [...prev, {room: room, body: 'nope', sender: props.user1, receiver: props.user2, time: new Date()}]);
		}
	}

	return (
		<div className="" style={{ marginBottom: 'revert', padding: 25, maxWidth: 550}}>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="d-flex align-items-end">
					
					<input className="form-control" placeholder="Message..." type="text" value={inputMessage} onChange={e => setInputMessage(e.target.value)} />
					<button disabled={inputMessage.replace(/\s/g, '').length === 0 || inputMessage.length > 420} className="btn btn-secondary" type="submit" ><i className="fa-regular fa-paper-plane"></i></button>
				</div>
			</form>
		</div>
	)
}

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
	})
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
			<small>online</small>
		)
	} else {
		return (
			<small>offline</small>
		)
	}
}

const Message = ({message}) => {

	const [user1, setUser1] = useState(0);
	const time = new Date(message.time).getHours() + ':' + new Date(message.time).getMinutes();
	
	getUser({target: 'self'}).then(response => {
		setUser1(response.data.id)
	})
	if (message.sender === user1) {
		return (
			<div className="d-flex" style={{padding: '1rem'}}>
				<div style={{width : "20%"}}></div>
				<div style={{fontSize : '0.6rem', color : "darkgray", marginRight : "10px"}}>{time}</div>
				<Badge bg="light" text="dark" className="text-wrap" style={{wordBreak : "break-word", minWidth: "70%", maxWidth : "80%", padding : '10px', textAlign : 'end', marginRight : '10px'}}>{message.body}</Badge>
			</div>
		)
	} else {
		return (
			<div className="d-flex" style={{padding: '1rem'}}>
				<Badge bg="secondary" style={{minWidth: "70%", maxWidth : "80%", padding : '10px', textAlign : 'start', marginLeft : '10px'}}>{message.body}</Badge>
				<div style={{fontSize : '0.6rem', color : "darkgray", marginLeft : "10px"}}>{time}</div>
				<div style={{width : "20%"}}></div>
			</div>
		)
	}
}

const Chat = ({props}) => {
	const socket = props.socket;
	const url = window.location.pathname;
	const bottomRef = useRef(null);

	const [message, setMessage] = useState([]);
	useEffect(() => {
		socket.on('receive_message', (data) => {
			if (url === `/direct/${data.room}`) {
				setMessagesToSeen({room: data.room, receiver: props.user1}).then(response => {
					if (response.data === 'error') {
						window.location.reload();
					}
					bottomRef.current?.scrollIntoView({behavior: 'smooth'});
				})
			}
			setMessage((prev) => [...prev, data]);
		})
		// eslint-disable-next-line
	}, [socket]) 
	if (message.length > 0) {
		return (
			<>
				{message.map((message, i) => {
					return <Message key={i} message={message}/>
				})}
				<div ref={bottomRef} />
			</>
		)
	}
}

const ChatHeader = ({user2}) => {
	
	const [user2Name, setUser2Name] = useState('');
	const [userPicture, setUserPicture] = useState('');
	const [userId, setUserId] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		if (user2 !== 0) {
				getUser({target : user2}).then(response => {
					const name = `${response.data.basicInfo.name} ${response.data.basicInfo.lastName}`
					setUserId(response.data.id)
					setUser2Name(name);
					getUserPhotos({target: user2}).then(response => {
						setUserPicture('../' + response.data.pic_1)
					})
				})
		}
	}, [user2])
	return (
		<div className="header" style={{marginBottom: '1rem'}}>
			<Container fluid>
			<Row className="align-items-center">
				<Col md={1} xs={1} lg={1} ><p onClick={() => {navigate('/messages')}} style={{cursor : 'pointer', margin: '0'}}>{'<<'}</p></Col>
				<Col md={1} xs={2} lg={1} ><Image src={userPicture} roundedCircle style={{width : '2rem'}}/></Col>
				<Col><h4 style={{margin : '0'}}>{user2Name}</h4></Col>
				<Col md={2} xs={2} lg={2}><LoginStatus user={userId}/></Col>
			</Row>
			</Container>
		</div>
	)

}

export const ChatRoom = () => {
	const navigate = useNavigate();

	const room = useParams().roomId;
	const [user1, setUser1] = useState(0);
	const [user2, setUser2] = useState(0);
	const socket = useContext(SocketContext);
	const [messages, setMessages] = useState([]);
	const [login, setLogin] = useContext(LoginContext);
	const bottomRef = useRef(null);

	useEffect(() => {
		validator().then((response) => {
			if (response.data === 'token invalid' || response.data === 'no token') {
				setLogin(false)
				navigate('/login')
			}
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
		}).then(() => {
			if (login === true) {
				socket.emit('join_room', room);
				getUser({target: 'self'}).then(response => {
					setUser1(response.data.id)
				})
			}
		}).finally(() => {
			getMessages({room : room}).then(response => {
				setMessages(response.data);
			})
		})
	// eslint-disable-next-line
	}, [login]);

	bottomRef.current?.scrollIntoView({behavior: 'auto'});
		return (
			<>
				<div className="container" style={{marginBottom: 'revert', marginTop: '1rem', padding: 25, maxWidth: 550, borderStyle : 'solid',
													borderWidth : '1px', borderColor : 'lightgray', backgroundColor : 'white', borderRadius : 10}}>
				<ChatHeader user2={user2}/>
				<div className="" style={{height: '30rem' ,overflowY: 'scroll', marginBottom: 'revert', marginTop: 'revert', padding: 25, maxWidth: 550}}>
				{messages.map((message, i) => {
					return <Message key={i} message={message}/>
				})}
				<Chat props={{socket, room, user1}} />
				<div ref={bottomRef} />
				</div>
				<ChatFooter props={{user1, user2, socket, setMessages, messages}}/>
				</div>
			</>
		)
}
