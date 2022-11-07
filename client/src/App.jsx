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
import { createContext } from "react";
import { useState } from "react";
import { logOut } from "./services/login";
import {Button} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {io} from 'socket.io-client';

const socket = io("http://localhost:5000");


export const LoginContext = createContext();

const Navigation = () => {

	const Navigate = useNavigate();
	const handleLogout = (e) => {
		e.preventDefault()
		logOut().then(response => {
				socket.emit("login");
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
				<Nav.Link href="/home" >Home</Nav.Link>
				<Nav.Link href="/profile">Profile</Nav.Link>
				<Nav.Link>Settings</Nav.Link>
				<Button onClick={(e) => handleLogout(e) }>Log Out</Button>
			</Container>
		</Navbar>
	)
}

const App = () => {
	const [loggedIn, setLoggedIn] = useState(true);
	return (
		<LoginContext.Provider value={{loggedIn, setLoggedIn}}>
		<>
		<Navigation />
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/home" element={<HomePage />} />
			<Route path="/:message" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/completeaccount" element={<SetUpProfile />} />
			<Route path="/completeaccount/photos" element={<ProfilePictureUpload />} />
			<Route path="/activateaccount/:token" element={<ActivateAccount />} />
			<Route path="/profile" element={<ProfilePage />}/>
			<Route path="/profilecard" element={<ProfileCard target={'self'} />}/>
		</Routes>
		</>
		</LoginContext.Provider>
	);
};

export default App;
