import { useState } from 'react';
import { createUser } from '../services/register.js'
import React from 'react';

const RegisterForm = () => {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [emailAlreadyInUse, setEmailAlreadyInUse] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		const userObject = {
			name: name + ' ' + lastName,
			email: email,
			password: password
		}
		createUser(userObject).then((response) => {
			console.log(response.status)
			if (response.status === 201) {
				console.log('user created');
				setSuccess('Account created successfully, check your email to activate it and finish setting up your account');
			}
			if (response.status === 228) {
				setEmailAlreadyInUse('Email already in use');
			}
		});
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

	return (
		<div className='p-5'>
			<div className='input-group flex-column m-40 text-warning'>
				<h2>Register</h2>
				<form>
					<label htmlFor="name" className="form-label" >Name</label><br></br>
					<input className='form-control' type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br></br>
					<label htmlFor='lastName'>Last Name</label><br></br>
					<input id="lastName" className='form-control' type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /><br></br>
					<label htmlFor="email">Email</label><br></br>
					<input id="email" className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<small className='text-danger'>{emailAlreadyInUse}</small><br></br>
					<label htmlFor='password'>Password</label><br></br>
					<input id="password" className='form-control' type="password" value={password} placeholder="8-13ch. a-z A-Z 0-9" onChange={(e) => handleChangePassword(e.target.value)} />
					<small className='text-muted'>Min. 8 Max. 13 characters containing at least: 1 uppercase, 1 lowercase, 1 number</small><br></br><br></br>
					<label htmlFor='passwordRepeat' >Repeat Password</label><br></br>
					<input id="passwordRepeat" className='form-control' type="password" value={repeatPassword} onChange={(e) => handleChangeRepeatPassword(e.target.value)} />
					<small className='text-danger'>{error}</small><br></br>
					<button type="button" className="btn btn-outline-warning" onClick={handleSubmit}>SUBMIT</button>
				</form>
				<p>{success}</p>
			</div>
		</div>
	);
};

export default RegisterForm;