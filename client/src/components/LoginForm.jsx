import {useState} from 'react';

const LoginForm = () => {
	const [name, setName] = useState('Amedeo');
	const [lastName, setLastName] = useState('Majer');
	const [email, setEmail] = useState('apemajer@gmail.com');
	const [password, setPassword] = useState('Amedeo11');
	const [repeatPassword, setRepeatPassword] = useState('Amedeo11');
	const [error, setError] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(name, lastName, email, password, repeatPassword);
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
		<div className='container-fluid'>
			<h2>Register</h2>
			<form>
				<label>Name</label><br></br>
				<input className='' type="text" value={name} onChange={(e) => setName(e.target.value)} /><br></br>
				<label>Last Name</label><br></br>
				<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /><br></br>
				<label>Email</label><br></br>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br></br>
				<label>Password</label><br></br>
				<input type="text" value={password} onChange={(e) => handleChangePassword(e.target.value)} /><br></br>
				<small>Min. 8 Max. 13 characters containing at least:<br></br>1 uppercase, 1 lowercase, 1 number</small><br></br>
				<label>Repeat Password</label><br></br>
				<input type="text" value={repeatPassword} onChange={(e) => handleChangeRepeatPassword(e.target.value)} /><br></br>
				<br></br>
				<small className='text-danger'>{error}</small><br></br>
				<button type="button" className="btn btn-outline-warning" onClick={handleSubmit}>SUBMIT</button>
			</form>
		</div>
	);
};

export default LoginForm;