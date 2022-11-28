import { useState, useContext, useEffect } from "react";
import { Container} from "react-bootstrap";
import { validator } from "../services/validator";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import { likeDislike } from "../services/match";
import like from "../images/like1.png";
import dislike from "../images/like2.png";
import {Spinner} from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import LoginContext from "../contexts/loginContext";
import SocketContext from "../contexts/socketContext";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "react-bootstrap/badge";
import { getLoggedInUsers } from "../services/users";
import { fetchMatch } from "../services/match";
import { Col, Row, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { updateViewStats, updateLikeStats } from "../services/stats";

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

const LoginStatus = ({user, lastLogin}) => {
	const socket = useContext(SocketContext);
	const [login, setLogin] = useState(false);
	const [string, setString] = useState('');
	console.log(lastLogin);
	const date = new Date(lastLogin);
	const now = new Date();
	const diff = now - date;
	const minutes = Math.floor(diff / 1000 / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	console.log(minutes, hours, days);

	useEffect(() => {
		getLoggedInUsers().then(response => {
			const users = response.data;
			console.log('userfvfbf vdxbfxvbcxs', typeof(user));
			if (users.length > 0) {
				if (users.includes(parseInt(user))){
					console.log('user is logged in');
					setLogin(true)
				}
				else {
					setLogin(false)
					if (days > 0) {
						setString(`${days} ${days === 1 ? "day" : "days"} ago`);
					}
					else if (hours > 0) {
						setString(`${hours} ${hours === 1 ? "hour" : "hours"} ago`);
					}
					else if (minutes > 0) {
						setString(`${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`);
					}
					else {
						setString('a moment ago');
					}
				}
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
	console.log('USER: ',user)
	if (login) {
		return (
			<div>
				<p style={{color : 'gray', fontSize : '0.5'}}>Online {string}</p>
			</div>
		)
	} else {
		return (
			<div>
				<p style={{color : 'gray', fontSize : '0.5'}}>Last online {string}</p>
			</div>
		)
	}
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
						src={`../${image}`}
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

const UserCard = ({props}) => {
	const target = props.target
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
	const [matched, setMatched] = useState(false);
	const [liked, setLiked] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const navigate =useNavigate();
	const [lastLogin, setLastLogin] = useState('');

	
	const calculateAge = (birthday) => {
	
		let birthDate = new Date(birthday);
		const today = new Date();
		
		const ageMS = today - birthDate;
		setAge(Math.floor(ageMS / 31536000000));
	}
	useEffect(() => {

		updateViewStats({target: target}).then(response => {
			console.log(response.data);
		})
		fetchMatch({target: target}).then(response => {
			console.log(response.data)
			if (response.data === 'blocked') {
				navigate('/home')
			}
			else if (response.data === 'no show') {
				setLiked(true);
			}
			else if (response.data === 'match') {
				setLiked(true);
				setMatched(true);
			}
		})
		const obj = { target: props.target }
		getUser(obj).then(response => {
			console.log('All the data:', response.data)
			setUsername(response.data.basicInfo.username)
			setName(response.data.basicInfo.name)
			setLastName(response.data.basicInfo.lastName)
			calculateAge(response.data.basicInfo.birthday)
			setGender(response.data.basicInfo.gender)
			setPreference(response.data.basicInfo.preference)
			setBio(response.data.basicInfo.bio)
			setinterests(response.data.basicInfo.interests.replace(/\[|\]|"/g, '').split(','));
			setScore(response.data.basicInfo.score)
			const locationTemp = response.data.locations.user_set_city ? response.data.locations.user_set_city :
								response.data.locations.gps_city ? response.data.locations.gps_city :
								response.data.locations.ip_city;
			setLocation(locationTemp)
			setLastLogin(response.data.basicInfo.registration_date)
		});
		getUserPhotos(obj).then(response => {
			console.log(response.data)
			setPictures(response.data);
		})
	}, [props.target, liked])

	const tags = interests ? interests.map((tag, index) => {
		if (userTags.includes(tag)) {
			return <Badge key={index} className='bg-dark text-light' style={{border : "solid 1px black", marginLeft: "3px"}} variant="primary">{tag}</Badge>
		} else {
			return <Badge key={index} className='bg-light text-dark' style={{border : "solid 1px black", marginLeft: "3px"}} variant="primary">{tag}</Badge>
		}
	}) : null;

	const handleLike = () => {
		likeDislike({target : target, like : true}).then(response => {
			updateLikeStats({target : target}).then(response => {
				console.log(response.data)
			})
			console.log(response)
			setLiked(true)
		})
	}
	const handleDislike = () => {
		likeDislike({target : target, like : false}).then(response => {
			console.log(response)
			setLiked(true)
		})
	}
	const handleReportBlock = (value) => {
		console.log(value)
		if (value === 1) {
			likeDislike({target : target, like : false, report : 'report'}).then(response => {
				setLiked(true)
				window.location.reload();
			})
		} else if (value === 2) {
			likeDislike({target : target, like : false}).then(response => {
				setLiked(true)
				window.location.reload();
			})
		}
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
				<div className="card mb-2" style={{ maxWidth: 500, borderRadius: '0 !important'}} onDoubleClick={() => handleLike()} >
					<CarouselImages pictures={pictures} />
					<div className="card-body">
						<Container>
							<Row>
								<Col>{target === "self" ?  null :<LoginStatus className="m-2" user={target} lastLogin={lastLogin}/> } </Col>
							</Row>
							<Row>
								<Col xs={7} sm={7} md={7} lg={7} ><Card.Title>{username}, {age}</Card.Title></Col>
								<Col className=""><StarRating rating={score / 10} /></Col>
							</Row>
							<div className="d-flex justify-content-around">
								{liked === true ? null : <motion.i whileHover={{ scale: 1.2, color: '#a3a3a3'}} className="fa-regular fa-heart fa-2x" style={{cursor:'pointer'}} onClick={() => handleLike()} src={like}/>}
								{liked === true ? null : <motion.i whileHover={{ scale: 1.2, color: '#a3a3a3'}} className="fa-solid fa-heart-crack fa-2x" style={{cursor:'pointer'}} onClick={() => handleDislike()} src={dislike}/>}
							</div>
							<Info name={name} lastName={lastName} location={location} preference={preference} gender={gender} bio={bio}/>
						</Container>
						<div className='row p-2'>
							<div className='col'>{tags}</div>
						</div>
						<div className="d-flex justify-content-around">
								<small style={{ textDecoration : 'underline' , cursor : 'pointer'}} onClick={() => handleReportBlock(1)}>report</small>
								<small style={{ textDecoration : 'underline' , cursor : 'pointer'}} onClick={() => handleReportBlock(2)}>block</small>
						</div>
					</div>
				</div>
			</div>
		)
	}
};

export const UserPage = () => {

	const props = {
		target : useParams().id,
	}
	console.log('smotheng elseeeee')
	const [login, setLogin] = useContext(LoginContext);
	const navigate = useNavigate();

	validator().then((response) => {
		console.log((response.data))
		if (response.data === 'token invalid') {
			navigate('/')
		}
		else {
			setLogin(true)
		}
	})

	useEffect (() => {
		getUser({target: 'self'}).then(response => {
			if (response.data.id === parseInt(props.target)) {
				navigate('/profile');
			}
		})
	})


	console.log('login context in pp:', login);
	return (
			<Container id="nav-plus-form" className="p-0">
				<div className="row row justify-content-center ">
				</div>
				<div style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}>
					<UserCard props={props} />
				</div>
			</ Container>
	);
};
