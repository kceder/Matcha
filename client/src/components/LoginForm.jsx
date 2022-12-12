import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/login";
import { updateGpsLocation, updateIpLocation } from "../services/location";
import { geoApiKey } from "../services/env";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import SocketContext from "../contexts/socketContext";

const LoginForm = () => {
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState('');
	const [message, setMessage] = useState('')
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
		user : email,
		password,
		};

		loginUser(userObject).then((response) => {
			if (response.data === "user not found") setError("User not found");
			else if (response.data === "wrong password") setError("Wrong password");
			else if (response.data === "account not verified") setError("Account not activated! Please check your email");
			else if (response.status === 202) {

				if (navigator.geolocation) {
					
					navigator.geolocation.getCurrentPosition((position, error) => {

						const userLocation = {
							lat: position.coords.latitude,
							lon: position.coords.longitude,
						};

						if(Object.keys(userLocation).length > 0) {
							updateGpsLocation(userLocation)
						}
					}
				)}
				

				geoApiKey().then((response) => {
					const locationAPI = `https://ipgeolocation.abstractapi.com/v1/?api_key=${response.data}`;
					axios.get(locationAPI)
						.then(response => {
							const position = {
								lon: response.data.longitude,
								lat: response.data.latitude,
								city: `${response.data.city}, ${response.data.country_code}`
							}
							updateIpLocation(position)
						})
				})

				if (response.data === "fill profile") {
					Navigate('../completeaccount');
				}
				if (response.data.message === "login") {
					socket.emit("login");
					Navigate('../home');
				}
			}}
		)}
	
	const handleChangePassword = (event) => {
		setPassword(event);
	};

	return (
		<div style={{display: 'block', margin: 'auto', marginTop: '5rem',maxWidth: '25rem'}}>
		{message.length > 0 && <p>{message}</p>}
		<div className="input-group flex-column m-40 text-dark" >
			<h1>Welcome to Matcha</h1>
			<h6 style={{marginTop: '0.5rem', marginBottom: '2.5rem', color: 'gray'}}>Log in or create a new account</h6>
			<form>
			<label htmlFor="email">Email or Username</label>
			<br></br>
			<input
				id="email"
				className="form-control"
				type="email"
				value={email}
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
			/>
			<br></br>
			<label htmlFor="password">Password</label>
			<br></br>
			<input
				id="password"
				className="form-control"
				type="password"
				value={password}
				placeholder="Password"
				onChange={(e) => handleChangePassword(e.target.value)}
			/>
			<small className="text-danger" style={{marginBottom : '3px'}}>{error}</small>
			<br></br>
			<div className="d-flex justify-content-between" style={{marginTop : '1rem'}}>
				<button type="button" className="btn btn-outline-dark" onClick={handleSubmit}>
				Login
				</button>
				<button type="button" className="btn btn-dark" onClick={() => {Navigate('../restore')}}>
				Forgot password?
				</button>
			</div>
			</form>
			<p className="mt-5 m-lg-5">
			Don't Have an account? <Link to="/register">Sign up now!</Link>
			</p>
		</div>
		</div>
	);
	};


export default LoginForm;


