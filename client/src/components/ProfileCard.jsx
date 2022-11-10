import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';
import { Spinner } from "react-bootstrap";
import like from "../images/like.jpeg";
import dislike from "../images/dislike.jpeg";
import {Image} from "react-bootstrap";
import {likeDislike} from "../services/match"
import { getLoggedInUsers } from '../services/users';
import SocketContext from "../contexts/socketContext";
import {view} from "../services/notifications"
import { useContext } from "react";


const LoginStatus = ({user}) => {
	const socket = useContext(SocketContext);
	const [login, setLogin] = useState(false);
	useEffect(() => {
		getLoggedInUsers().then(response => {
			const users = response.data;
			if (users.length > 0) {
				if (users.includes(user))
					setLogin(true)
				else
					setLogin(false)
			}
		})
	}, [])
	useEffect(() => {
		socket.on("logged", (data) => {
			if (data.includes(user))
				setLogin(true)
			else
				setLogin(false)
		});
	}, [socket])
	

	if (login) {
		return (
			<div>
				<Spinner style={{textAlign: 'center'}} animation="grow" size="sm" role="status">
				</Spinner>
			</div> 
		)
	} else {
		return (
			<div>
				<Spinner style={{textAlign: 'center'}} animation="border" size="sm" role="status">
				</Spinner>
			</div>
		)
	}
}

const Info = ({name, lastName, location, preference, gender, bio}) => {
	return (
		<div className="mt-4">
			<div className="row">
				<div className="col-7">
					<p className="list-group-item">{name} {lastName}</p>
				</div>
				<div className="col-5">
					<p className="list-group-item">{location}</p>
				</div>
			</div>
			<div className="row">
				<p >{preference}, {gender}</p>
			</div>
			<div className="row">
				<p className="card-text">{bio}</p>
			</div>
		</div>
	)
}

const StarRating = ({rating}) => {
	
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		if (i <= rating) {
			stars.push(<i key={i} className="fas fa-star"></i>);
		} else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
			stars.push(<i key={i} className="fas fa-star-half-alt"></i>);
		} else {
			stars.push(<i key={i} className="far fa-star"></i>);
		}
	}

	return (
		<>
			{stars}
		</>
	)
}

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

const ProfileCard = ({setUsers, users, target, setDisplayUsers, displayUsers}) => {

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
	const [score, setScore] = useState();
	const [userTags, setUserTags] = useState([]);
	const socket = useContext(SocketContext);
	const [infoShow, setInfoShow] = useState(false);


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
			setinterests(response.data.basicInfo.interests.replace(/\[|\]|"/g, '').split(','));
			setScore(response.data.basicInfo.score)
			getUser({target : "self"}).then(response => {
				setUserTags(response.data.basicInfo.interests.replace(/\[|\]|"/g, '').split(','));
		})



			
			getUserPhotos(obj).then(response => {
				setPictures(response.data);
			})

			const locationTemp = response.data.locations.user_set_city ? response.data.locations.user_set_city :
							response.data.locations.gps_city ? response.data.locations.gps_city :
							response.data.locations.ip_city;
			setLocation(locationTemp)
		})
	}, [target])
	
	const calculateAge = (birthday) => {
	
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;
		setAge(Math.floor(ageMS / 31536000000));
	}
	const tags = interests ? interests.map((tag, index) => {
		if (userTags.includes(tag)) {
			return <Badge key={index} className='bg-dark text-light' style={{border : "solid 1px black", marginLeft: "3px"}} variant="primary">{tag}</Badge>
		} else {
			return <Badge key={index} className='bg-light text-dark' style={{border : "solid 1px black", marginLeft: "3px"}} variant="primary">{tag}</Badge>
		}
	}) : null;
	
	
	const showHideInfo = () => {
		if (infoShow === false) {
			const obj = {target: target, username: username};
			view(obj).then(response => {
				console.log(response.data)
				socket.emit('notification', response.data);
			})
		}
		setInfoShow(!infoShow);
	}
	const handleLike = () => {
		likeDislike({target : target, like : true}).then(response => {
			setUsers(
				users.filter(user => user.id !== target)
			)
			if (users[displayUsers.length]) {
				setDisplayUsers(
					displayUsers.push(users[displayUsers.length])
					)
			}
			setDisplayUsers(
				displayUsers.filter(user => user.id !== target)
			)
		})
	}
	const handleDislike = () => {
		likeDislike({target : target, like : false}).then(response => {
			if (users[displayUsers.length]) {
				setDisplayUsers(
					displayUsers.push(users[displayUsers.length])
					)
			}
			setUsers(
				users.filter(user => user.id !== target)
			)
			setDisplayUsers(
				displayUsers.filter(user => user.id !== target)
			)
		})
	}
	if (pictures.length === 0) {
		return (
			<div className="" style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}>
			<Spinner style={{textAlign: 'center'}} animation="grow" role="status">
				<span style={{textAlign: 'center'}} className="sr-only">Loading...</span>
			</Spinner>
			</div>
		)
	} else {
		return (
			<>
				<div className="card mb-2" style={{ maxWidth: 500}} >
					<CarouselImages pictures={pictures} />
					<div className="card-body">
						<div className="container">
							<div className="row">
								<div className="col-7">
									<div>
										{target === "self" ?  null :<LoginStatus className="m-2" user={target}/> }<h5 className="ml-2 card-title">{username}, {age}</h5>
									</div> 
								</div>
								<div className="col-5">
									<StarRating rating={score / 10} />
								</div>
							</div>
							<div className="d-flex justify-content-around">
									{target === "self" ? null : <Image style={{cursor:'pointer'}} onClick={() => handleLike()} src={like} width="80"  />}
									{infoShow === false ? <i style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-down"></i> : <i style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-up"></i>}
									{target === "self" ? null : <Image style={{cursor:'pointer'}} onClick={() => handleDislike()} src={dislike} width="80"  />}
							</div>
							{infoShow ? <Info name={name} lastName={lastName} location={location} preference={preference} gender={gender} bio={bio}/> : null}
						</div>
					<div className='row p-2'>
						<div className='col'>{tags}</div>
					</div>
					</div>
				</div>
			</>
		)
	}
}

export default ProfileCard;
