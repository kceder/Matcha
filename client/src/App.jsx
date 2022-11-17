import { Routes, Route } from "react-router-dom";
import ActivateAccount from "./components/AccountActivation";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { SetUpProfile } from "./pages/setUpProfile";
import { ProfilePage } from "./pages/profilePage";
import  AddPhotos from "./components/completeAccountForms/AddPhotos";
import  ProfilePictureUpload from "./components/completeAccountForms/ProfilePictureUpload";
import { Navbar, Container, Nav } from 'react-bootstrap';
import ProfileCard from './components/ProfileCard'
import HomePage from "./pages/HomePage";
import './components/style/mennu.css';
import { useContext, createContext } from "react";
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

const Navigation = ({socket}) => {
	const [login, setLogin] = useContext(LoginContext);
	const [newNotifications, setNewNotifications] = useState(false);
	const [unreadNotifications, setUnreadNotifications] = useState(false);
	
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
			}
		}, [login])
	socket.on('receive notification', (data) => {
		console.log('DATA IN App', data);
		if (login === true) {
			console.log('AFTER LOGIN ##########')
			console.log('AFTER LOGIN ##########')
			console.log('AFTER LOGIN ##########')
			console.log('AFTER LOGIN ##########')
			getUser({target: 'self'}).then(response => {
				console.log('RESPONSE in App:', response.data.id);
				console.log('FROM_ID in App: ', data.from_id);
				if (response.data.id === data.to || response.data.id === data.from_id) {
					console.log('NEW NOTIFICATION ======================');
					setNewNotifications(true);
					setUnreadNotifications(true);
				}
			})
		}
	})
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
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand href="/home">
				<h1 style={{
					background: 'url(https://static01.nyt.com/images/2022/08/09/well/09ASKWELL-WILDFIRES-CANCER3/merlin_211227660_ccc9570a-94a8-40a5-b3b2-403a08d84d2b-superJumbo.jpg?quality=75&auto=webp)',
					backgroundSize: 'cover',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					fontWeight: "bolder",
				}} >MATCHA</h1>
				</Navbar.Brand>
				{ login === true ? <Nav.Link href="/home" > <i className="fa-solid fa-house"></i></Nav.Link> :null}
				{ login === true ? <Nav.Link href="/profile"> <i className="fa-solid fa-user"></i></Nav.Link> :null}
				{ login === true ? <Nav.Link  href="/messages"><i className="fa-solid fa-comments"></i></Nav.Link> :null}
				{ login === true ? 
					<Nav.Link href="/notifications">
						<div style={{position: 'relative'}}>
							<i className={unreadNotifications === true ? "fa-solid fa-bell" : "fa-regular fa-bell"}></i>
							<Spinner animation="grow" size="bg" variant="light" style={{display: newNotifications ? 'block' : 'none', position: 'absolute', marginTop: '-25px', marginLeft: "-0.10px"}}/>
						</div>
					</Nav.Link> : null}
				{ login === true ? <i onClick={(e) => handleLogout(e)} className="fa-solid fa-arrow-right-from-bracket"></i> :null}
			</Container>
		</Navbar>
	)
}
const App = () => {
	
	const socket = io.connect("http://localhost:5000");
	const [login, setLogin] = useState(false);
	const [notificationsShown, setNotificationsShown] = useState(false);

	return (
		<SocketContext.Provider value={socket}>
			<LoginContext.Provider value={[login, setLogin]}>
					<Navigation socket={socket}/>
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
					</Routes>
			</LoginContext.Provider>
		</SocketContext.Provider>
	);
};

export default App;
