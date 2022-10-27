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
import './components/style/mennu.css';

const Navigation = () => {
	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand href="#home">
				<h1 style={{
							fontWeight: "bolder",
							background: "-webkit-linear-gradient(blue, brown)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
						}} >MATCHA</h1>
				</Navbar.Brand>
				<Nav.Link>Home</Nav.Link>
				<Nav.Link>Profile</Nav.Link>
				<Nav.Link>Settings</Nav.Link>
			</Container>
		</Navbar>
	)
}

const App = () => {
	return (
		<>
		<Navigation />
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/:message" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/completeaccount" element={<SetUpProfile />} />
			<Route path="/completeaccount/photos" element={<ProfilePictureUpload />} />
			<Route path="/activateaccount/:token" element={<ActivateAccount />} />
			<Route path="/profile" element={<ProfilePage />}/>
			<Route path="/profilecard" element={<ProfileCard target={'self'} />}/>
		</Routes>
		</>
	);
};

export default App;
