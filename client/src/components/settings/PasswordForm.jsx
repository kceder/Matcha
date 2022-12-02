import React from "react";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { changePassword } from "../../services/settings";

const PasswordForm = () => {

	const [newPassword, setNewPassword] = useState('Malibu11');
	const [newPasswordRepeat, setNewPasswordRepeat] = useState('Malibu11');
	const [oldPassword, setOldPassword] = useState('Amedeo11');
	const [error, setError] = useState('');
	const regex = new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,13}$')

	const handleNewPasswordChange = (event) => {
		setNewPassword(event.target.value);
		if(regex.test(event.target.value) === false) {
			if (event.target.value.length > 13)
				setError('password too long')
			else
				setError('password too weak')
		} else {
			setError('');
		}
	}

	const handleRepeatPasswordChange = (event) => {
		setNewPasswordRepeat(event.target.value);
		if (event.target.value !== newPassword)
			setError('passwords don\'t match');
		else
			setError('');
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		if(newPassword !== newPasswordRepeat) {
			setError("passwords don't match!")
		} else if (regex.test(newPassword) === false) {
			setError("password weak!")
		} else {
			const passwordObject = {
				newPassword,
				oldPassword
			}
			changePassword(passwordObject)
		}
	}

	return (
		<Form onSubmit={(e) => handleSubmit(e)}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>New Password</Form.Label>
				<Form.Control type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => handleNewPasswordChange(e)}/>
				<Form.Text className="text-muted">
					8 to 13 charachters, one uppercase letter, one lowercase letter and one number
				</Form.Text>
			</Form.Group>

			<Form.Group className="mb-3" id="rep-pass" controlId="formBasicPassword">
				<Form.Label>Repeat New Password</Form.Label>
				<Form.Control type="password" placeholder="Repeat New Password" value={newPasswordRepeat} onChange={(e) => handleRepeatPasswordChange(e)}/>
			</Form.Group>
			
			<Form.Group className="mb-3" id="old-pass" controlId="formBasicPassword " >
				<Form.Label>Old Password</Form.Label>
				<Form.Control type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
			</Form.Group>

			<Button variant="dark" type="submit">
				Submit
			</Button>
			<span className="text-secondary" >{error}</span>
		</Form>
	);
}

export default PasswordForm;