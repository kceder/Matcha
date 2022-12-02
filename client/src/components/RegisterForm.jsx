import { useState } from 'react';
import { createUser } from '../services/register.js'
import React from 'react';
import { useNavigate } from 'react-router-dom';

const validateEmail = (email) => {
	const regex = new RegExp('^(?!.{51})[a-z0-9]+(?:.[a-z0-9]+)*@[a-z0-9]+(?:[.-][a-z0-9-]+)*.[a-zA-Z]{2,6}$');
	return regex.test(String(email).toLowerCase());
}

const RegisterForm = () => {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [emailAlreadyInUse, setEmailAlreadyInUse] = useState('');
	const [usernameAlreadyInUse, setUsernameAlreadyInUse] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();
		const passwordRegex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,13}$')
		if (password !== repeatPassword) {
			setError('Passwords do not match');
			return;
		} else if (passwordRegex.test(password) === false) {
			setError('Password must be between 8 and 13 characters, contain at least one uppercase letter, one lowercase letter and one number');
		} else if (!validateEmail(email)) {
			setError('Invalid email');
		} else if (name.length < 2) {
			setError('Name too short');
		} else if (name.length > 20) {
			setError('Name too long');
		} else if (lastName.length < 2) {
			setError('Last name too short');
		} else if (lastName.length > 20) {
			setError('Last name too long');
		} else if (username.length > 50) {
			setError('Username too long');
		} else if (username.length < 5) {
			setError('Username too short');
		} else {
			const userObject = {
				name,
				lastName,
				username,
				email,
				password
			}
			createUser(userObject).then((response) => {
				if (response.status === 201) {
					setSuccess('Account created successfully, check your email to activate it and finish setting up your account');
					setTimeout(() => {
						navigate('/login');
					}, 3000);
				}
				if (response.status === 228) {
					if (response.data === 'Username already in use')
						setUsernameAlreadyInUse(response.data)
					else
						setEmailAlreadyInUse(response.data);
				}
			});
		}
	}

	const handleChangePassword = (event) => {
		const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,13}$')
		setPassword(event);
		if(regex.test(event) === false) {
			setError('password too weak')
		} else {
			setError('');
		}
	}

	const handleChangeRepeatPassword = (event) => {
		setRepeatPassword(event);

		if (password !== event) {
			setError('passwords do not match');
		} else {
			setError('');
		}
	}

	const handleNameChange = (event) => {
		// regex for letters between 1 and 20 characters// 
		const regex = new RegExp('^[a-zA-Z]{1,20}$');
		if (regex.test(event.target.value) === true || event.target.value === '') 
			setName(event.target.value);
	}

	const handleLastNameChange = (event) => {
		// regex for letters between 1 and 20 characters// 
		const regex = new RegExp('^[a-zA-Z]{1,20}$');
		if (regex.test(event.target.value) === true || event.target.value === '') 
			setLastName(event.target.value);
	}

	const handleUsernameChange = (event) => {
		// regex for letters and numbers between 1 and 20 characters// 
		const regex = new RegExp('^[a-zA-Z0-9]{1,50}$');
		if (regex.test(event.target.value) === true || event.target.value === '')
			setUsername(event.target.value);
	}

	return (
		<div className='p-5'>
			<div className='input-group flex-column m-40 text-secondary'>
				<h2>Register</h2>
				<form>
					<label htmlFor="name" className="form-label" >Name</label><br></br>
					<input className='form-control' type="text" id="name" value={name} onChange={(e) => handleNameChange(e)} required/><br></br>
					<label htmlFor='lastName'>Last Name</label><br></br>
					<input id="lastName" className='form-control' type="text" value={lastName} onChange={(e) => handleLastNameChange(e)} required/><br></br>
					<label htmlFor='lastName'>Username</label><br></br>
					<input id="username" className='form-control' type="text" value={username} onChange={(e) => handleUsernameChange(e)} required/>
					<small className='text-dark'>{usernameAlreadyInUse}</small><br></br>
					<label htmlFor="email">Email</label><br></br>
					<input id="email" className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
					<small className='text-dark'>{emailAlreadyInUse}</small><br></br>
					<label htmlFor='password'>Password</label><br></br>
					<input id="password" className='form-control' type="password" value={password} placeholder="8-13ch. a-z A-Z 0-9" onChange={(e) => handleChangePassword(e.target.value)} required/>
					<small className='text-muted'>Min. 8 Max. 13 characters containing at least: 1 uppercase, 1 lowercase, 1 number</small><br></br><br></br>
					<label htmlFor='passwordRepeat' >Repeat Password</label><br></br>
					<input id="passwordRepeat" className='form-control' type="password" value={repeatPassword} onChange={(e) => handleChangeRepeatPassword(e.target.value)} required/>
					<small className='text-dark'>{error}</small><br></br>
					<button type="button" className="btn btn-outline-secondary" onClick={handleSubmit}>SUBMIT</button>
				</form>
				<p>{success}</p>
			</div>
		</div>
	);
};

export default RegisterForm;