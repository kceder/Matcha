import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';

const CarouselImages = ({pictures}) => {

	const array = Object.keys(pictures).map(key => pictures[key])
	array.shift();
	array.shift();
	const images = array.map((image, index) => {
		if (image) {
			return (
				<Carousel.Item key={index}>
					<img
						className="d-block w-100"
						src={image}
						alt="First slide"
					/>
				</Carousel.Item>
			)
		} else 
			return null;
	})

	return (
		<Carousel interval={null} slide={false}>
			{images}
		</Carousel>
	)
}

const ProfileCard = ({target}) => {
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [gender, setGender] = useState('');
	const [preference, setPreference] = useState('');
	const [location, setLocation] = useState('');
	const [bio, setBio] = useState('');
	const [pictures, setPictures] = useState([]);
	const [age, setAge] = useState();
	const [interests, setinterests] = useState();


	useEffect(() => {
		
		const obj = { target: target }
		getUser(obj).then(response => {

			setUsername(response.data.basicInfo.username)
			setName(response.data.basicInfo.name)
			setLastName(response.data.basicInfo.lastName)
			calculateAge(response.data.basicInfo.birthday)
			setGender(response.data.basicInfo.gender)
			setPreference(response.data.basicInfo.preference)
			setBio(response.data.basicInfo.bio)
			setinterests(response.data.basicInfo.interests.replace(/\[|\]|\"/g, '').split(','));




			
			getUserPhotos(obj).then(response => {
				setPictures(response.data);
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
	const tags = interests ? interests.map((tag, index) => {
		return <Badge key={index} className='bg-light text-dark' style={{border : "solid 1px black", marginLeft: "3px"}} variant="primary">{tag}</Badge>
	}) : null;
	
	return (
		<>
			<div className="card col-md-4 col-lg-2" >
				<CarouselImages pictures={pictures} />
				<div className="card-body">
					<h5 className="card-title">{username}, {age} </h5>

					<ul className="list-flush p-0">
						<li className="list-group-item">{name} {lastName}</li>
						<li className="list-group-item">{preference}, {gender}</li>
						<li className="list-group-item">{location}</li>

					</ul>
				</div>
				<div className='mt-1 mb-1'>
					{tags}
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
