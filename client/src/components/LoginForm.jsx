import React from 'react';
import { useState } from 'react';
import {Link} from 'react-router-dom';
import { loginUser } from '../services/login';
import { cookieProvider } from 'react-cookie';

const LoginForm = () => {
	const [email, setEmail] = useState('apemajer@gmail.com');
	const [password, setPassword] = useState('Amedeo11');
	const [error, setError] = useState();

	const handleSubmit = (event) => {
		event.preventDefault();
		const userObject = {
			email: email,
			password: password
		}
		loginUser(userObject).then((response) => {
			if (response.data === 'user not found')
				setError('User not found');
			else if (response.data === 'wrong password')
				setError('Wrong password');
			else if (response.status === 200)
				console.log(response.data.accessToken);
		});

	}

	const handleChangePassword = (event) => {
		setPassword(event);
	}

	return (
		<div className='p-5'>
			<div className='input-group flex-column m-40 text-warning'>
				<h2>Login</h2>
				<form>
					<label htmlFor="email">Email</label><br></br>
					<input id="email" className='form-control' type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br></br>
					<label htmlFor='password'>Password</label><br></br>
					<input id="password" className='form-control' type="text" value={password} placeholder="8-13ch. a-z A-Z 0-9" onChange={(e) => handleChangePassword(e.target.value)} />
					<small className='text-danger'>{error}</small><br></br>
					<div className="d-flex justify-content-between">
						<button type="button" className="btn btn-outline-warning" onClick={handleSubmit}>Login</button>
						<button>forgot password?</button>
					</div>
				</form>
				<p className='mt-5 m-lg-5'>Don't Have an account? <Link to="/register">sign up now!</Link></p>
			</div>
		</div>
	);
};

export default LoginForm;