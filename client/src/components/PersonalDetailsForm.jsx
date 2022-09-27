import React, { useState, useEffect } from 'react'
import { setUpUser } from '../services/register';

const PersonalDetailsForm = () => {

	const [bio, setBio] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [age, setAge] = useState('');
	const [preference, setPreference] = useState('');
	const [interests, setInterests] = useState('');
	const [error, setError] = useState('');



	const handleGenderChange = (event) => {
		setGender(event);
		console.log(event);
	}

	const handleBioChange = (event) => {
		if (event.target.value.length > 500) {
			setError('Bio is too long');
		} else {
			setError('');
		}
		setBio(event.target.value);
		console.log(event.target.value);
	}

	const handleBirthdayChange = (event) => {
		setBirthday(event);
		const today = new Date();
		const birthDate = new Date(event);
		const ageMS = today - birthDate;
		setAge(Math.floor(ageMS / 31536000000));
	}

	const handleInterestsChange = (event) => {
		setInterests(event);
		console.log(event);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(age)
		if (!bio || !gender || !birthday || !preference || !interests) {
			setError('Please fill in all fields');
		}
		else if (age < 18) {
			setError('You must be 18 years old to use this website');
		}
		const userObject = {
			gender,
			bio,
			birthday,
			preference,
			interests,
		};
		setUpUser(userObject).then((response) => {
			console.log(response);
		})
	}

	return (
	<div className='p-5'>
		<div className='input-group flex-column m-40 text-warning'>
			<h2>Complete your accout</h2>
			<form className='d-flex flex-column'>
				<label htmlFor="gender" className="form-label" >Gender</label>
				<select id='gender' className="form-select" aria-label="Default select example" onChange={(e) => handleGenderChange(e.target.value)} defaultValue={''} required>
					<option value="" disabled>-- select --</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
				<label htmlFor='bio'>Bio</label>
				<input id="bio" className='form-control' type="text" maxLength={500} value={bio} onChange={(e) => handleBioChange(e)} required/>
				<small className='align-self-end'>{bio.length}/500</small>
				<label htmlFor="birthday">Birthday</label>
				<input id="birthday" className='form-control' type="date" value={birthday} onChange={(e) => handleBirthdayChange(e.target.value)} required/>
				<label htmlFor="preference">Sexual Preference</label>
				<select id='preference' className="form-select" aria-label="Default select example" defaultValue={''} onChange={(e) => setPreference(e.target.value)} required>
					<option value="" disabled>-- select --</option>
					<option value="heterosexual">Heterosexual</option>
					<option value="homosexual">Homosexual</option>
					<option value="bisexual">Bisexual</option>
				</select>
				<label htmlFor="interests">Interests
				<input id="interests" className='form-control' type="text" value={interests} onChange={(e) => handleInterestsChange(e.target.value)} required/>
				</label>
				<button className="btn btn-outline-warning" type='submit' onClick={(e) => handleSubmit(e)}>Submit</button>
			</form>
			<small className='text-danger'>{error}</small>
		</div>
	</div>
	)
}

export default PersonalDetailsForm