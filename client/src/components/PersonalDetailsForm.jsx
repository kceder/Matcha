import React, { useState } from 'react'
import { setUpUser } from '../services/register';

const PersonalDetailsForm = () => {

	const [bio, setBio] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [age, setAge] = useState('');
	const [preference, setPreference] = useState('');
	const [interests, setInterests] = useState([]);
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

	const handleInterestsChange = (interest) => {
		if (!interests.includes(interest)) {
			let array = interests.concat(interest)
			setInterests(array);
		} else {
			let array = interests.filter(element => {
				return interest !== element
			})
			setInterests(array);
		}
		console.log(interests);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if (!bio || !gender || !birthday || !preference || !interests) {
			setError('Please fill in all fields');
		}
		else if (age < 18) {
			setError('You must be 18 years old to use this website');
		} else {
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
				<label htmlFor="interests">Interests</label>
				<fieldset className='d-flex flex-row flex-wrap'>
					<legend>Choose your interests:</legend>
					<div className='p-1'>
						<input type="checkbox" id="anime-manga" name="anime-manga" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="anime-manga">Anime and Manga</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="technology" name="technology" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="technology">Technology</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="music" name="music" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="music">Music</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="sports" name="sports" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="sports">Sports</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="nature" name="nature" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="nature">Nature</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="conspiracy" name="conspiracy" onChange={event => handleInterestsChange(event.target.id)} />
						<label htmlFor="conspiracy">Flat Earth "Theories"</label>
					</div>
					<div className='p-1'>
						<input type="checkbox" id="cinema" name="cinema" onChange={event => handleInterestsChange(event.target.id)}/>
						<label htmlFor="cinema">Cinema</label>
					</div>
				</fieldset>
				
				<button className="btn btn-outline-warning" type='submit' onClick={(e) => handleSubmit(e)}>Submit</button>
			</form>
			<small className='text-danger'>{error}</small>
		</div>
	</div>
	)
}

export default PersonalDetailsForm