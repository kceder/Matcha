import React from "react";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getUser } from "../../services/users";
import { changeUserInfo } from "../../services/settings";


const ProfileView = (userInfo) => {
	
}

const ProfileForm = () => {

	const [name, setName] = useState('');
	const [nameError, setNameError] = useState('');
	const [lastName, setLastName] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [gender, setGender] = useState('');
	const [preference, setPreference] = useState('');
	const [lat, setLat] = useState(0);
	const [latError, setLatError] = useState('');
	const [lon, setLon] = useState(0);
	const [lonError, setLonError] = useState('');
	const [bio, setBio] = useState('');
	const [bioError, setBioError] = useState('');


	useEffect(() => {
		const obj = { target: 'self' }
		getUser(obj).then(response => {
			setUsername(response.data.username)
			setName(response.data.name)
			setLastName(response.data.lastName)
			setEmail(response.data.email)
			setGender(response.data.gender)
			setPreference(response.data.preference)
			setBio(response.data.bio)

			console.log(response.data);
		})
	}, [])

	const handleUsernameChange = (event) => {
		var re = new RegExp(/^[A-Za-z0-9]*$/);

		if (event.target.value.length < 3) {
			setUsernameError('Username is too short');
		} else if (event.target.value.length > 15) {
			setUsernameError('Username is too long');
		} else if(re.test(event.target.value) === false) {
			setUsernameError('Only letter and numbers are allowed!')
		} else {
			setUsernameError('');
		}
		setUsername(event.target.value);
	}

	const handleNameChange = (event) => {
		var re = new RegExp(/^[A-Za-z]*$/);

		if (event.target.value.length > 20) {
			setNameError('Name is too long');
		} else if(re.test(event.target.value) === false) {
			setNameError('Only letters allowed!')
		} else {
			setNameError('');
		}
		setName(event.target.value);
	}

	const handleLastNameChange = (event) => {
		var re = new RegExp(/^[A-Za-z]*$/);

		if (event.target.value.length > 20) {
			setLastNameError('Last Name is too long');
		} else if(re.test(event.target.value) === false) {
			setLastNameError('Only letters allowed!')
		} else {
			setLastNameError('');
		}
		setLastName(event.target.value);
	}

	const handleEmailChange = (event) => {

		if (event.target.value.length > 200) {
			setEmailError('Email is too long');
		} else {
			setEmailError('');
		}
		setEmail(event.target.value);
	}
	const handleLocationClick = () => {
		const userLocation = {
			lat: 0,
			lon: 0
		};
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(( position ) => {
				
				userLocation = {
					lat: position.coords.latitude,
					lon: position.coords.longitude
				};

			})
			if(userLocation.lat === 0 && userLocation.lon === 0) {
				alert("are you from null island or your gps is not working?")
			} else {
				setLon(userLocation.lon);
				setLat(userLocation.lat);
			}
		}
	}
	const handleLatChange = (event) => {

		var re = new RegExp('^-?[0-9]{1,3}(?:.[0-9]{1,10})?$');
		if (re.test(event.target.value) === false) {
			setLatError('Not a valid latitude');
		} else {
			var latitude = parseFloat(event.target.value);
			if(latitude > 90 || latitude < -90) {
				setLatError('Not a valid latitude');
			}
			else {
				console.log(latitude)
				setLatError('');
			}
		}
		setLat(latitude)
	}

	const handleLonChange = (event) => {

		var re = new RegExp('^-?[0-9]{1,3}(?:.[0-9]{1,10})?$');
		if (re.test(event.target.value) === false) {
			setLonError('Not a valid longitude');
		} else {
			var longitude = parseFloat(event.target.value);
			if(longitude > 180 || longitude < -180) {
				setLonError('Not a valid longitude');
			}
			else {
				console.log(longitude)
				setLonError('');
			}
		}
		setLon(longitude)
	}

	const handleBioChange = (event) => {
		const noTagsBio = event.target.value.replace(/(<([^>]+)>)/ig, '');
		if (event.target.value.length > 500) {
			setBioError('Text too long!')
		}
		setBio(noTagsBio);
	}
	
	const handleGenderChange = (event) => {
		setGender(event.target.value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		const userObject = {
			username,
			name,
			lastName,
			email,
			"location" : {lat, lon},
			bio,
			gender,
			preference
		}
		changeUserInfo(userObject).then(response => {
			console.log(response)
		})
	}

	return (
		<>
			<Form.Group className="mb-3"  >
				<Form.Label>Username <span className="text-danger">{usernameError}</span></Form.Label>
				<Form.Control placeholder="Username" value={username} onChange={event => handleUsernameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label>Name <span className="text-danger">{nameError}</span></Form.Label>
				<Form.Control placeholder="Name" value={name} onChange={event => handleNameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label>Last Name <span className="text-danger">{lastNameError}</span></Form.Label>
				<Form.Control placeholder="Last Name" value={lastName} onChange={event => handleLastNameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label>Email <span className="text-danger">{emailError}</span> </Form.Label>
				<Form.Control placeholder="Email" value={email} onChange={event => handleEmailChange(event)} />
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label>Location <span className="text-danger">{latError}	{lonError}</span></Form.Label>
				<div className="row">
					<Form.Control type="number" className="col" placeholder="lat" value={lat} onChange={event => handleLatChange(event)}/>
					<Form.Control type="number" className="col" placeholder="lon" value={lon} onChange={event => handleLonChange(event)}/>
					<button className="col" onClick={() => handleLocationClick()}>lol</button>
				</div>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label>Bio  <span className="text-danger">{bioError}</span> </Form.Label>
				<Form.Control as="textarea" rows="3" placeholder="Bio" maxLength={500} value={bio} onChange={event => handleBioChange(event)} />
				<small className='align-self-end'>{bio.length}/500</small>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Gender</Form.Label>
				<Form.Select value={gender} onChange={(event => handleGenderChange(event))}>
					<option value={'female'} >Female</option>
					<option value={'male'} >Male</option>
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label>Preference</Form.Label>
				<Form.Select value={preference} onChange={event => setPreference(event.target.value)}>
					<option value={'heterosexual'} >Heterosual</option>
					<option value={'homosexual'}>Homosexual</option>
					<option value={'bisexual'}>Bisexual</option>
				</Form.Select>
			</Form.Group>
			<Button variant="primary" type="submit" onClick={(event) => handleSubmit(event)}>
				Submit
			</Button>
		</>
	)
}

export default ProfileForm