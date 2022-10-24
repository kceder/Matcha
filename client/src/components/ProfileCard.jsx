import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";



const ProfileCard = () => {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [gender, setGender] = useState('');
	const [preference, setPreference] = useState('');
	const [location, setLocation] = useState('');
	const [bio, setBio] = useState('');
	const [profilePicture, setProfilePicture] = useState('');
	const [age, setAge] = useState();

	useEffect(() => {
		
		const obj = { target: 'self' }
		getUser(obj).then(response => {
			setUsername(response.data.basicInfo.username)
			setName(response.data.basicInfo.name)
			setLastName(response.data.basicInfo.lastName)
			calculateAge(response.data.basicInfo.birthday)
			setGender(response.data.basicInfo.gender)
			setPreference(response.data.basicInfo.preference)
			setBio(response.data.basicInfo.bio)

			
			getUserPhotos(obj).then(response => {
				setProfilePicture(response.data.pic_1);
			})

			const locationTemp = response.data.locations.user_set_city ? response.data.locations.user_set_city :
							response.data.locations.gps_city ? response.data.locations.gps_city :
							response.data.locations.ip_city;
			setLocation(locationTemp)
		})
	}, [])
	
	const calculateAge = (birthday) => {
	
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;
		setAge(Math.floor(ageMS / 31536000000));
	}
	
	
	return (
		<>
			<div className="card col-md-4 col-lg-2" >
				<img src={profilePicture} className="card-img-top" alt="PROFILE IMAGE" />
				<div className="card-body">
					<h5 className="card-title">{username}, {age}</h5>
					<ul className="list-flush p-0">
						<li className="list-group-item">{name} {lastName}</li>
						<li className="list-group-item">{preference}, {gender}</li>
						<li className="list-group-item">{location}</li>
					</ul>
				</div>
				<hr></hr>
				<div className="card-body">
					<p className="card-text">{bio}</p>
				</div>
			</div>
		</>
	)
}

export default ProfileCard;
