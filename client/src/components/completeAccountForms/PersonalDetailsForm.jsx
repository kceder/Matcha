import React, { useState, useEffect, useContext } from 'react'
import { setUpUser } from '../../services/register';
import { useNavigate } from "react-router-dom";
import { getAllTags } from '../../services/tags';
import Badge from 'react-bootstrap/Badge';
import { logOut } from '../../services/login';
import SocketContext from '../../contexts/socketContext';
import LoginContext from '../../contexts/loginContext';

const AutocompleteTagsSelector = ({ tags, setTags, interests, setInterests }) => {

	const [newTag, setNewTag] = useState('');
	
	function containsWhitespace(str) {
		return /\s|\t/.test(str);
	}

	const removeInterest = (event, tag) => {

		setInterests(interests.filter((interest) => interest !== tag));
	};

	const handleTextInput = (event) => {
		if (event.target.value === ' ') {
			return;
		} else {
			const last = event.target.value.charAt(event.target.value.length - 1);
			if (containsWhitespace(last) === false) {
				if (event.target.value.length > 30) {
					alert('Tag must be less than 30 characters');
				} else {
					setNewTag(event.target.value.replace(/(<([^>]+)>)/ig, ''));
				}
			} else {
				setInterests([...interests, newTag.replace(/(<([^>]+)>)/ig, '')]);
				setNewTag('');
			}
		}
		
	};

	const handleInterestsChange = (event) => {
		if (interests.includes(event)) {
			return null;
		} else {
			setInterests(interests.concat(event));
		}
	}
	const submitTag = (event, newTag) => {
		if (newTag === '') {
			return null;
		} else if (interests.includes(newTag)) {
			setNewTag('');
			return null;
		} else {
			setInterests([...interests, newTag]);
			setNewTag('');
		}
	}
	const options = tags.map((tag) => <option key={tag.id} value={tag.tag}>{tag.tag}</option>)
	const selectedTags = interests.map((tag, i) => <Badge style={{padding: '9px', cursor : 'pointer' }} key={i} value={tag} bg="secondary" className="m-1" onClick={(event) => removeInterest(event, tag)}>{tag}</Badge>)
	return (
		<div>
			<select id='tags' className="form-select" defaultValue={''} onChange={(e) => handleInterestsChange(e.target.value)} required>
				<option value="" disabled>-- select --</option>
				{options}
			</select>
			<div className='mt-1 mb-1'>
				<Badge bg="secondary" ><input value={newTag} style={{ outline: 'none', border: 'none', borderRadius: '2px'}} type='text' onChange={(e) => handleTextInput(e)}></input><Badge className="m-1" bg="dark" value={newTag} onClick={(event) => submitTag(event, newTag)}>+</Badge></Badge>{selectedTags}
			</div>
		</div>
	);
}

const PersonalDetailsForm = () => {

	const [bio, setBio] = useState('');
	const [gender, setGender] = useState('');
	const [birthday, setBirthday] = useState('');
	const [age, setAge] = useState('');
	const [preference, setPreference] = useState('');
	const [tags, setTags] = useState([]);
	const [interests, setInterests] = useState([]);
	const [error, setError] = useState('');
	const Navigate = useNavigate();
	const { socket } = useContext(SocketContext);
	const [login, setLogin] = useContext(LoginContext);

	
	useEffect(() => {
		getAllTags().then((response) => {
			setTags(response.data);
		})
	}, [])

	const handleGenderChange = (event) => {
		setGender(event);
	}

	const handleBioChange = (event) => {
		if (event.target.value.length > 500) {
			setError('Bio is too long');
		} else {
			setError('');
		}
		setBio(event.target.value);
	}

	const handleBirthdayChange = (event) => {
		setBirthday(event);
		const today = new Date();
		const birthDate = new Date(event);
		const ageMS = today - birthDate;
		setAge(Math.floor(ageMS / 31536000000));
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
				tags,
			};
			setUpUser(userObject).then((response) => {
				if(response.data === 'good') {
					Navigate('/completeaccount/photos');
				}
			})
		}
	}

	return (
	<div className='p-5'>
		<div className='input-group flex-column m-40 text-secondary'>
			<h2>Complete your accout</h2>
			<form className='d-flex flex-column' onSubmit={(e) => handleSubmit(e)}>
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
				<label>Interests</label>
				<AutocompleteTagsSelector tags={tags} setTags={setTags} interests={interests} setInterests={setInterests} />
				
				<button className="btn btn-outline-secondary" type='submit'>Submit</button>
			</form>
			<small className='text-dark'>{error}</small>
		</div>
	</div>
	)
}

export default PersonalDetailsForm