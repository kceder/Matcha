import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';
import { Col, Container, Row, Spinner, Card } from "react-bootstrap";
import like from "../images/like2.png";
import dislike from "../images/like1.png";
import {likeDislike} from "../services/match"
import { getLoggedInUsers } from '../services/users';
import SocketContext from "../contexts/socketContext";
import {view} from "../services/notifications"
import {liked} from "../services/notifications"
import {disliked} from "../services/notifications"
import { useContext } from "react";
import { motion } from "framer-motion"
import { updateViewStats, updateLikeStats } from "../services/stats";
import { useNavigate } from "react-router-dom";

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
	}, [login, user])
	useEffect(() => {
		socket.on("logged", (data) => {
			if (data.includes(user))
				setLogin(true)
			else
				setLogin(false)
		});
	}, [socket, user])

	if (login) {
		return (
				<Spinner style={{textAlign: 'center', width: "0.8rem", height: "0.8rem" }} animation="grow" role="status"></Spinner>
		)
	} else {
		return (
				// <Spinner style={{textAlign: 'center', width: "0.8rem", height: "0.8rem",  }} variant="secondary" animation="border" size="sm" role="status"></Spinner>
				<i style={{textAlign: 'center', width: "0.5rem", height: "0.5rem",  color: 'gray'}} className="fa-regular fa-circle-xmark"></i>
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
			stars.push(<i key={i} style={{width: '3'}} className="fas fa-star-half-alt"></i>);
		} else {
			stars.push(<i key={i} className="far fa-star"></i>);
		}
	}

	return (
		<div style={{width: 100}}>
			{stars}
		</div>
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


const ProfileCard = ({setShow, setUsers, users, target, setDisplayUsers, displayUsers}) => {

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
	const [animation, setAnimation] = useState({ x: 0, y: 0 });
	const navigate = useNavigate();

	useEffect(() => {
		const obj = { target: target }
		getUser(obj).then(response => {

			if (target === 'self') {
				if (response.data.basicInfo.acti_stat === 2) {
					navigate('/completeaccount/photos');
					return;
				}
				else if (response.data.basicInfo.acti_stat === 1) {
					navigate('/completeaccount');
					return;
				}
			}
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
		// eslint-disable-next-line
	}, [target])
	
	const calculateAge = (birthday) => {
	
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;

		const ageDate = new Date(ageMS);
		const age = Math.abs(ageDate.getUTCFullYear() - 1970);
		setAge(age);
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
			if (target !== "self") {
				view(obj).then(response => {
					socket.emit('notification', response.data);
				})
				updateViewStats(obj)
			}
			
		}
		setInfoShow(!infoShow);
	}

	const handleNavigateToProfile = () => {
		if (target !== 'self') {
			window.location.href = `/user/${target}`
		}
	}

	const handleLike = () => {
		setAnimation({x: -1000});
		setTimeout(() => {
		const obj = {target: target, username: username};
		likeDislike({target : target, like : true}).then(response => {
			updateLikeStats({target: target})
			if (response.data === 'match') {
				setShow({show: true, message: 'You matched with ' + username + ' !'});
			}
			liked(obj).then(response => {
				socket.emit('notification', response.data);
			})
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
		}, 500)
	}
	
	const handleDislike = () => {
		setAnimation({x: 1000});
		setTimeout(() => {
		const obj = {target: target, username: username};
		disliked(obj).then(response => {
			socket.emit('notification', response.data);
		})
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
		}, 500)
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
			<div style={{marginBottom : '1.5rem', marginTop : '1.5rem'}}>
				<motion.div
				initial={{}}
				animate={animation}
				transition={{ duration: 0.4 }}
				className="card mb-2" style={{ maxWidth: 500, borderRadius: '0 !important'}} >
					<CarouselImages pictures={pictures} />
					<div className="card-body">
						<Container>
							<Row>
								<Col xs={1} sm={1} md={1} lg={1}>{target === "self" ?  null :<LoginStatus className="m-2" user={target}/> } </Col>
								<Col xs={7} sm={7} md={7} lg={7} ><Card.Title style={{cursor:'pointer'}} onClick={(e) => {handleNavigateToProfile(e)}}>{username}, {age}</Card.Title></Col>
								<Col className=""><StarRating rating={score / 10} /></Col>
							</Row>
							<div className="d-flex justify-content-around">
									{target === "self" ? null : <motion.i whileHover={{ scale: 1.2, color: '#a3a3a3'}} className="fa-regular fa-heart fa-2x" style={{cursor:'pointer'}} onClick={() => handleLike()} src={like}/>}
									{infoShow === false ? <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-down"/> : <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-up"></motion.i>}
									{target === "self" ? null : <motion.i whileHover={{ scale: 1.2, color: '#a3a3a3'}} className="fa-solid fa-heart-crack fa-2x" style={{cursor:'pointer'}} onClick={() => handleDislike()} src={dislike}/>}
							</div>
							{infoShow ? <Info name={name} lastName={lastName} location={location} preference={preference} gender={gender} bio={bio}/> : null}
						</Container>
					<div className='row p-2'>
						<div className='col'>{tags}</div>
					</div>
					</div>
				</motion.div>
			</div>
		)
	}
}

export default ProfileCard;
