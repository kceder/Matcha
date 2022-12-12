import React from "react";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getUser } from "../../services/users";
import { changeUserInfo } from "../../services/settings";
import { motion } from "framer-motion";
import { Badge } from "react-bootstrap";
import { getAllTags } from "../../services/tags";

const Updated = ({updated}) => {
	if (updated) {
		return (
			<motion.div
			initial={{ opacity: 1 }}
			animate={{ opacity: 0 }}
			transition={{ duration: 2.5 }}
			style={{ fontSize : '2rem', textAlign : 'center'}}>{updated}
			</motion.div>
		)
	} else {
		return (
			<div></div>
		)
	}
}

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
				if (interests.includes(newTag) === false) {
					setInterests([...interests, newTag.replace(/(<([^>]+)>)/ig, '')]);
					setNewTag('');
				} else {
					setNewTag('')
				}
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
	const [updated, setUpdated] = useState('');
	const [tags, setTags] = useState([]);
	const [interests, setInterests] = useState([]);
	const [successfull, setSuccesfull] = useState('')

	useEffect(() => {
		getAllTags().then((response) => {
			setTags(response.data);
		})
	}, [])

	useEffect(() => {
		const obj = { target: 'self' }
		getUser(obj).then(response => {
			setUsername(response.data.basicInfo.username)
			setName(response.data.basicInfo.name)
			setLastName(response.data.basicInfo.lastName)
			setEmail(response.data.basicInfo.email)
			setGender(response.data.basicInfo.gender)
			setPreference(response.data.basicInfo.preference)
			setInterests(response.data.basicInfo.interests.replace(/\[|\]|"/g, '').split(','));
			setBio(response.data.basicInfo.bio)
			if (response.data.locations.user_set_location !== null) {
				setLat(response.data.locations.user_set_location.y)
				setLon(response.data.locations.user_set_location.x)
			}
			else if (response.data.locations.gps_location !== null) {
				setLat(response.data.locations.gps_location.y)
				setLon(response.data.locations.gps_location.x)
			}
			else {
				setLat(response.data.locations.ip_location.y)
				setLon(response.data.locations.ip_location.x)
			}
		})
	}, [])

	const handleUsernameChange = (event) => {
		var re = new RegExp(/^[A-Za-z0-9]*$/);
		const regex = new RegExp('^[a-zA-Z0-9]{0,50}$');
		if (regex.test(event.target.value) === true) {
			if (event.target.value.length < 6) {
				setUsernameError(' is too short')
			} else if (event.target.value.length > 15) {
				setUsernameError(' is too long');
				setUsernameError('');
			} else if(re.test(event.target.value) === false) {
				setUsernameError('Only letter and numbers are allowed!')
			} else {
				setUsernameError('');
			}
			setUsername(event.target.value);
		}
		
	}

	const handleNameChange = (event) => {
		var re = new RegExp(/^[A-Za-z]*$/);

		if (event.target.value.length > 20) {
			setNameError(' is too long');
		} else if(re.test(event.target.value) === true) {
			setName(event.target.value);
			setNameError('');
		} else if(re.test(event.target.value) === false) {
			setNameError('Only letters are allowed!')
		} else {
			setNameError('');
		}
		
	}

	const handleLastNameChange = (event) => {
		var re = new RegExp(/^[A-Za-z]*$/);

		if (event.target.value.length > 20) {
			setLastNameError(' is too long');
		} else if(re.test(event.target.value) === true) {
			setLastName(event.target.value);
			setLastNameError('');
		} else if(re.test(event.target.value) === false) {
			setLastNameError('Only letters are allowed!')
		} else {
			setLastNameError('');
		}
		
	}

	const handleEmailChange = (event) => {

		if (event.target.value.length > 200) {
			setEmailError(' is too long');
		} else {
			setEmailError('');
		}
		setEmail(event.target.value);
	}
	const handleLocationClick = () => {
		let userLocation = {
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
			else
				setLatError('');
		}
		if (event.target.value === '')
			setLat(event.target.value);
		else
			setLat(latitude);
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
			else
				setLonError('');
		}
		if (event.target.value === '')
			setLon(event.target.value);
		else
			setLon(longitude);
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
		if (usernameError === '' && nameError === '' && lastNameError === '' && emailError === '' && latError === '' && lonError === '' && bioError === ''){
			if (username !== '' && name !== '' && lastName !== '' && email !== '' && lat !== '' && lon !== '' && bio !== ''){
				const userObject = {
					username,
					name,
					lastName,
					email,
					"location" : {lat, lon},
					bio,
					gender,
					preference,
					interests,
					tags
				}
				changeUserInfo(userObject).then(response => {
					console.log(response.data)
					if (response.data === 'email exists' || response.data === 'invalid email') {
						setEmailError('is invalid');
					} else if (response.data === 'username exists') {
						setUsernameError('username already taken');
					} else if (response.data === 'OK') {
						setUpdated('Profile updated');
						setSuccesfull('Profile Updated')
						setTimeout(() => {

							setSuccesfull('')
						}, 1000)
					}
				})
			}
		}
	}

	return (
		<>
			<div className="container" style={{ maxWidth : '25rem' }}>
			<Updated updated={updated}/>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary">Username <span className="text-dark">{usernameError}</span></Form.Label>
				<Form.Control placeholder="Username" value={username} onChange={event => handleUsernameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary" >Name <span className="text-dark">{nameError}</span></Form.Label>
				<Form.Control placeholder="Name" value={name} onChange={event => handleNameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary" >Last Name <span className="text-dark">{lastNameError}</span></Form.Label>
				<Form.Control placeholder="Last Name" value={lastName} onChange={event => handleLastNameChange (event)}/>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary" >Email <span className="text-dark">{emailError}</span> </Form.Label>
				<Form.Control placeholder="Email" value={email} onChange={event => handleEmailChange(event)} />
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary" >Location <span className="text-dark">{latError}	{lonError}</span></Form.Label>
				<div className="d-flex">
					<Form.Control type="number" min="0" className="col" placeholder="lat" value={lat} onChange={event => handleLatChange(event)}/>
					<Form.Control type="number" min="0" className="col" placeholder="lon" value={lon} onChange={event => handleLonChange(event)}/>
					<Button className="col" style={{width : '90%'}} variant="secondary" onClick={() => handleLocationClick()}>GPS</Button>
				</div>
			</Form.Group>
			<Form.Group className="mb-3"  >
				<Form.Label className="text-secondary" >Bio  <span className="text-dark">{bioError}</span> </Form.Label>
				<Form.Control as="textarea" rows="3" placeholder="Bio" maxLength={500} value={bio} onChange={event => handleBioChange(event)} />
				<small className='align-self-end'>{bio.length}/500</small>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label className="text-secondary" >Gender</Form.Label>
				<Form.Select value={gender} onChange={(event => handleGenderChange(event))}>
					<option value={'female'} >Female</option>
					<option value={'male'} >Male</option>
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label className="text-secondary" >Preference</Form.Label>
				<Form.Select value={preference} onChange={event => setPreference(event.target.value)}>
					<option value={'heterosexual'} >Heterosexual</option>
					<option value={'homosexual'}>Homosexual</option>
					<option value={'bisexual'}>Bisexual</option>
				</Form.Select>
			</Form.Group>
			<Form.Group className="mb-3">
				<Form.Label className="text-secondary" >Tags</Form.Label>
				<AutocompleteTagsSelector tags={tags} setTags={setTags} interests={interests} setInterests={setInterests} />
			</Form.Group>
			<Button variant="secondary" type="submit" onClick={(event) => handleSubmit(event)}>
				Submit
			</Button>
			<span className="text-secondary m-3">{successfull}</span>
			</div>
		</>
	)
}

export default ProfileForm