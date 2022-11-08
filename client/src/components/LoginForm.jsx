import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/login";
import { updateGpsLocation, updateIpLocation } from "../services/location";
import { geoApiKey } from "../services/env";
// import { cookieProvider, Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import LoginContext from "../contexts/loginContext";
import SocketContext from "../contexts/socketContext";

const LoginForm = () => {
	
	const [email, setEmail] = useState("a@a.a");
	const [password, setPassword] = useState("Malibu11");
	const [error, setError] = useState('');
	const [message, setMessage] = useState('')
	const [location, setLocation] = useState({});
	const [login, setLogin] = useContext(LoginContext);
	const socket = useContext(SocketContext);

	const Navigate = useNavigate();

	const param = useParams().message;

	useEffect(() => {
		if (param !== undefined && param === 'acccount_on') {
			setMessage('Account activated, you can now login!')
		}
	}, [param]);
	

	const handleSubmit = (event) => {
		event.preventDefault();
		const userObject = {
		email,
		password,
		};

		loginUser(userObject).then((response) => {
			if (response.data === "user not found") setError("User not found");
			else if (response.data === "wrong password") setError("Wrong password");
			else if (response.status === 202) {

				if (navigator.geolocation) {
					
					navigator.geolocation.getCurrentPosition((position, error) => {

						if (error) console.log(error);
						const userLocation = {
							lat: position.coords.latitude,
							lon: position.coords.longitude,
						};

						if(Object.keys(userLocation).length > 0) {
							updateGpsLocation(userLocation).then(response => console.log(response))
						}
					}
				)}
				

				geoApiKey().then((response) => {
					console.log('api key', response.data)
					const locationAPI = `https://ipgeolocation.abstractapi.com/v1/?api_key=${response.data}`;
					axios.get(locationAPI)
						.then(response => {
							console.log('65', response)
							const position = {
								lon: response.data.longitude,
								lat: response.data.latitude,
								city: `${response.data.city}, ${response.data.country_code}`
							}
							console.log(position)
							updateIpLocation(position).then(response => {
								console.log(response);
							})
						})
				})

				if (response.data === "fill profile") {
					Navigate('../completeaccount');
				}
				if (response.data.message === "login") {
					setLogin(true);
					socket.emit("login");
					Navigate('../profile')
				}
			}}
		)}
	
	const handleChangePassword = (event) => {
		setPassword(event);
	};

	return (
		<div className="p-5">
		{message.length > 0 && <p>{message}</p>}
		<div className="input-group flex-column m-40 text-warning">
			<h2>Login</h2>
			<form>
			<label htmlFor="email">Email</label>
			<br></br>
			<input
				id="email"
				className="form-control"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<br></br>
			<label htmlFor="password">Password</label>
			<br></br>
			<input
				id="password"
				className="form-control"
				type="text"
				value={password}
				placeholder="8-13ch. a-z A-Z 0-9"
				onChange={(e) => handleChangePassword(e.target.value)}
			/>
			<small className="text-danger">{error}</small>
			<br></br>
			<div className="d-flex justify-content-between">
				<button type="button" className="btn btn-outline-warning" onClick={handleSubmit}>
				Login
				</button>
				<button>forgot password?</button>
			</div>
			</form>
			<p className="mt-5 m-lg-5">
			Don't Have an account? <Link to="/register">sign up now!</Link>
			</p>
		</div>
		</div>
	);
	};

export default LoginForm;
