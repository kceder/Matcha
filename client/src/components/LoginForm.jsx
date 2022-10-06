import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../services/login";
import { geoApiKey } from "../services/env";
// import { cookieProvider, Cookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
// import axios from 'axios'

const LoginForm = () => {
	
	const [email, setEmail] = useState("amedeo@majer.it");
	const [password, setPassword] = useState("Amedeo11");
	const [error, setError] = useState('');
	const [message, setMessage] = useState('')
	const [location, setLocation] = useState({});

	// const Navigate = useNavigate();

	const param = useParams().message;

	useEffect(() => {
		geoApiKey().then((response) => {
			const locationAPI = `https://ipgeolocation.abstractapi.com/v1/?api_key=${response.data}`;
			axios.get(locationAPI)
				.then(response => {
					console.log(response.data)
					const position = {
						lon: response.data.longitude,
						lat: response.data.latitude,
					}
					setLocation(position);
				})
		})
	}, []);

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
		location,
		};
		loginUser(userObject).then((response) => {
		console.log(response.data)
		if (response.data === "user not found") setError("User not found");
		else if (response.data === "wrong password") setError("Wrong password");
		else if (response.status === 202) {
			// the cookie has been set in the backend and the user is authenticated
			
			if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const userLocation = {
					lat: position.coords.latitude,
					lon: position.coords.longitude,
				};
				console.log(userLocation);
			});
			} else {
				console.log('gps location unavailable')
			}
			

			// if (response.data === "fill profile") {
			// 	Navigate('../completeaccount');
			// }
			// if (response.data === "login") {
			// 	Navigate('')
			// }  NAVIGATE TO HOMEPAGE
		}
		});
	};

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
