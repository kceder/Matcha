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

export const LoginContext = createContext();

const Navigation = () => {
	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand href="/home">
				<h1 style={{
							fontWeight: "bolder",
							background: "-webkit-linear-gradient(blue, brown)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}} >MATCHA</h1>
				</Navbar.Brand>
				<Nav.Link href="/home" >Home</Nav.Link>
				<Nav.Link href="/profile">Profile</Nav.Link>
				<Nav.Link>Settings</Nav.Link>
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
