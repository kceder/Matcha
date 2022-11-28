import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "../services/users";
import { getUserPhotos } from "../services/photos";
import Badge from 'react-bootstrap/Badge';
import Carousel from 'react-bootstrap/Carousel';
import { Col, Container, Row, Spinner, Card, Toast } from "react-bootstrap";
import like from "../images/like2.png";
import dislike from "../images/like1.png";
import {Image} from "react-bootstrap";
import {likeDislike} from "../services/match"
import { getLoggedInUsers } from '../services/users';
import SocketContext from "../contexts/socketContext";
import {view} from "../services/notifications"
import {liked} from "../services/notifications"
import {disliked} from "../services/notifications"
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { updateViewStats, updateLikeStats } from "../services/stats";
import { getStats } from "../services/stats";


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

const List = ({ list }) => {
	console.log(list)
	return (
		<div style={{background : 'blue', position : 'absolute'}}>
		</div>
	)
	// if (list === null || list.length === 0)
	// 	return ;
	// else {

	// 	return (
	// 		<div className="d-flex justify-content-center" style={{height : '100%'}}>
	// 	<div className="p-3" style={{border : 'solid 1px grey', borderRadius: '3%', position: 'absolute', zIndex : '99', background : 'white', width : '80%'}}>
	// 		<div>
	// 			{list.map((item) => (<p key={item.id}>{item.name}</p>))}
	// 		</div>
	// 	</div>
	// </div>
	// );
// }
};

const Stats = ({ target }) => {
	const [views, setViews] = useState(0);
	const [likes, setLikes] = useState(0);
	const [rating, setRating] = useState(0);
	const [viewHistory, setViewHistory] = useState([]);
	const [likeHistory, setLikeHistory] = useState([]);
	const [blocks, setBlocks] = useState(0);
	const [matches, setMatches] = useState([]);
	const [done, setDone] = useState(false);
	const [profilePic, setProfilePic] = useState('');
	const [show, setShow] = useState(false);
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


	const showHideInfo = () => {
		if (infoShow === false) {
			const obj = {target: target, username: username};
			if (target !== "self") {
				view(obj).then(response => {
					console.log(response.data)
					socket.emit('notification', response.data);
				})
				updateViewStats(obj).then(response => {
					console.log(response.data)
				})
			}
			
		}
		setInfoShow(!infoShow);
	}

	useEffect(() => {
		getStats({target : target}).then(response => {
			setViews(response.data.views);
			setLikes(response.data.likes);
			setViewHistory(JSON.parse(response.data.view_history));
			setLikeHistory(JSON.parse(response.data.like_history));
			setBlocks(response.data.block);
			setMatches(JSON.parse(response.data.matches));
		}).then(() => {
			getUserPhotos({target : target}).then(response => {
				setProfilePic(response.data.pic_1);
			})
			setDone(true);
		})
	}, []);

	if (done === true) {
		return (
			<div style={{marginBottom : '1.5rem', marginTop : '1.5rem'}}>
					<CarouselImages pictures={pictures} />
					<div className="card-body">
						<Container>							<Row>
								<Col xs={7} sm={7} md={7} lg={7} ><Card.Title>{username}, {age}</Card.Title></Col>
								<Col className=""><StarRating rating={score / 10} /></Col>
							</Row>
							<div className="d-flex justify-content-around">
									{infoShow === false ? <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-down"/> : <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-up"></motion.i>}
							</div>
							{infoShow ? <List /> : null}
						</Container>
					<div className='row p-2'>
						<div className='col'>fbgdjsfjkds</div>
					</div>
					</div>
			</div>
		)
	}
	
}

export default Stats;