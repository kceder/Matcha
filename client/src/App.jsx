import { Routes, Route } from "react-router-dom";
import ActivateAccount from "./components/AccountActivation";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { SetUpProfile } from "./pages/setUpProfile";
import { ProfilePage } from "./pages/profilePage";
import  ProfilePictureUpload from "./components/completeAccountForms/ProfilePictureUpload";
import { Navbar, Container, Nav } from 'react-bootstrap';
import HomePage from "./pages/HomePage";
import './components/style/mennu.css';
import { useContext} from "react";
import { useState } from "react";
import { logOut } from "./services/login";
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client';
import React from "react";
import SocketContext from "./contexts/socketContext";
import LoginContext from "./contexts/loginContext";
import NotificationsPage from "./pages/NotificationsPage";
import { getUser } from "./services/users";
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { getNofications } from "./services/notifications";
import { UserPage } from "./pages/UserPage";
import { ChatPage } from "./pages/ChatPage";
import { validator } from "./services/validator";
import { motion } from "framer-motion";
import {ChatRoom} from "./pages/ChatRoom"
import { checkForUnreadMessages } from "./services/chat";
import RestorePassword from "./components/RestorePassword";


const Navigation = ({socket}) => {

	const [login, setLogin] = useContext(LoginContext);
	const [newNotifications, setNewNotifications] = useState(false);
	const [unreadNotifications, setUnreadNotifications] = useState(false);
	const [newMessages, setNewMessages] = useState(false);
	const [unreadMessages, setUnreadMessages] = useState(false);
	const url = window.location.pathname;
	const navigate = useNavigate();

	useEffect(() => {
		validator().then(response => {
			if (response.data === 'valid') {
				setLogin(true);
			}
		})
		// eslint-disable-next-line
	}, [url])

	useEffect(() => {
		if (login) {
			getNofications().then(response => {
				if (response.data.length === 0)
					setUnreadNotifications(false)
				else {
					response.data.forEach(element => {
						if (element.read === 0)
							setUnreadNotifications(true)
					});
				}
			})
			checkForUnreadMessages().then(response => {
				if (response.data.unseenMessages > 0)
					setUnreadMessages(true);
			})
		}
	}, [login])

	socket.on('receive notification', (data) => {
		validator().then(response => {
			if (response.data === 'valid' || response.data === 'unlike') {
				getUser({target: 'self'}).then(response => {
					if (response.data.id === parseInt(data.to) || response.data.id === data.from_id) {
						setNewNotifications(true);
						setUnreadNotifications(true);
					}
				})
			}
			else {
				navigate('/login')
			}
		})
	})
	socket.on('message_notification', (data) => {
		validator().then(response => {
			if (response.data === 'valid') {
				getUser({target: 'self'}).then(response => {
					if (response.data.id === data.receiver && url !== `/direct/${data.room}` && url !== '/messages') {
						setNewMessages(true);
						setUnreadMessages(true);
					}
				})
			}
		})
	})
	useEffect(() => {
		if (login) {
			getUser({ target : 'self' }).then(response => {
					if (response.data.basicInfo.acti_stat === 1) {
						navigate('/completeaccount');
					} else if (response.data.basicInfo.acti_stat === 2) { 
						navigate('/completeaccount/photos');
					}
			})
		}
		// eslint-disable-next-line
	}, [url, login])
	const Navigate = useNavigate();
	const handleLogout = (e) => {
		e.preventDefault()
		logOut().then(response => {
			setLogin(false);
			socket.emit('login');
			Navigate('/');
		})
	};

	return (
		<Navbar bg="light" expand="lg" position="absolute" top="0px">
			<Container>
				<Navbar.Brand href={url === '/completeaccount' ? null : url === '/completeaccount/photos' ? null : login === true ? "/home" : '/login'}>
				<motion.h1
					whileHover={{ scale: 1.1 }} 
					style={{
					background: 'url(https://static01.nyt.com/images/2022/08/09/well/09ASKWELL-WILDFIRES-CANCER3/merlin_211227660_ccc9570a-94a8-40a5-b3b2-403a08d84d2b-superJumbo.jpg?quality=75&auto=webp)',
					backgroundSize: 'cover',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					fontWeight: "bolder",
				}} >MATCHA</motion.h1>
				</Navbar.Brand>
				{ login === true ? <Nav.Link href="/home" > <motion.i whileHover={{ scale: 1.4, color: '#a3a3a3'}} className="fa-solid fa-house"/></Nav.Link> : null}
				{ login === true ? <Nav.Link href="/profile"> <motion.i whileHover={{ scale: 1.4, color: '#a3a3a3'}} className="fa-solid fa-user"/></Nav.Link> : null}
				{ login === true ? 
					<Nav.Link  href="/messages">
						<div style={{position: 'relative'}}>
							<motion.i whileHover={{ scale: 1.4, color: '#a3a3a3'}} className={unreadMessages === true ? "fa-solid fa-comments" : "fa-regular fa-comments"}/>
							<Spinner animation="grow" size="bg" variant="light" style={{display: newMessages ? 'block' : 'none', position: 'absolute', marginTop: '-28px', marginLeft: "-6.12px"}}/>
						</div>
					</Nav.Link> 
					: null}
				{ login === true ? 
					<Nav.Link href="/notifications">
						<div style={{position: 'relative'}}>
							<motion.i whileHover={{ scale: 1.4, color: '#a3a3a3'}} className={unreadNotifications === true ? "fa-solid fa-bell" : "fa-regular fa-bell"}/>
							<Spinner animation="grow" size="bg" variant="light" style={{display: newNotifications ? 'block' : 'none', position: 'absolute', marginTop: '-25px', marginLeft: "-0.10px"}}/>
						</div>
					</Nav.Link> : null}
				{ login === true ? <motion.i whileHover={{ scale: 1.4, color: '#a3a3a3'}}  onClick={(e) => handleLogout(e)} className="fa-solid fa-arrow-right-from-bracket"/> :null}
			</Container>
		</Navbar>
	)
}
const App = () => {
	
	const socket = io.connect("http://localhost:5001");
	const [login, setLogin] = useState(false);

	validator().then(response => {
		if (response.data === 'valid')
			setLogin(true);
	})

	return (
		<SocketContext.Provider value={socket}>
			<LoginContext.Provider value={[login, setLogin]}>
					<Navigation socket={socket} />
					<Routes>
						<Route path="/" element={<Login />} />
						<Route path="/home" element={<HomePage />} />
						<Route path="/:message" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/completeaccount" element={<SetUpProfile />} />
						<Route path="/completeaccount/photos" element={<ProfilePictureUpload />} />
						<Route path="/activateaccount/:token" element={<ActivateAccount />} />
						<Route path="/profile" element={<ProfilePage />}/>
						<Route path="/user/:id" element={<UserPage />}/>
						<Route path="/notifications" element={<NotificationsPage />}/>
						<Route path="/messages" element={<ChatPage />}/>
						<Route path="/direct/:roomId" element={<ChatRoom />}/>
						<Route path="/restore/:token" element={<RestorePassword />} />
						<Route path="/restore" element={<RestorePassword />} />
					</Routes>
			</LoginContext.Provider>
		</SocketContext.Provider>
	);
};

export default App;
