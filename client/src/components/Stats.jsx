import React from "react";
import { useState, useEffect } from "react";
import { getUserPhotos } from "../services/photos";
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Card } from "react-bootstrap";
import { motion} from "framer-motion"
import { getStats } from "../services/stats";
import { useNavigate } from "react-router-dom";

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

const List = ({ props }) => {
	const navigate = useNavigate();
	if (props.views === 0 && props.likes === 0) {
		return (
			<div>
				Nothings to see yet!
			</div>
		)
	} else {
		return (
			<div className="d-flex justify-content-around" style={{maxHeight : '80px', overflowY : 'scroll'}}>
				{props.viewHistory.length > 0 ? <div className="col-4">VIEWS{props.viewHistory.map(view => <div onClick={() => navigate(`/user/${view.id}`)} key={view.id}><small style={{cursor : 'pointer'}}>{view.name}</small><br></br></div>)}</div> : <>no views yet</>}
				{props.likeHistory.length > 0 ? <div className="col-4">LIKES{props.likeHistory.map(view => <div onClick={() => navigate(`/user/${view.id}`)} key={view.id}><small style={{cursor : 'pointer'}}>{view.name}</small><br></br></div>)}</div> : <>no likes yet</>}
			</div>
		)
	}
	
};

const Stats = ({ target }) => {
	const [views, setViews] = useState(0);
	const [likes, setLikes] = useState(0);


	const [done, setDone] = useState(false);
	const [pictures, setPictures] = useState([]);
	const [infoShow, setInfoShow] = useState(false);
	const [props, setProps] = useState({});


	const showHideInfo = () => {
		setInfoShow(!infoShow);
	}

	useEffect(() => {
		getStats({target : target}).then(response => {
			setViews(response.data.views);
			setLikes(response.data.likes);
			setProps({
				views: response.data.views,
				likes: response.data.likes,
				viewHistory: response.data.view_history ? JSON.parse(response.data.view_history) : [],
				likeHistory: response.data.like_history ? JSON.parse(response.data.like_history) : [],
			})
		}).then(() => {
			getUserPhotos({target : target}).then(response => {
				setPictures(response.data);
			})
			setDone(true);
		})
	});

	if (done === true) {
		return (
			<div style={{marginBottom : '1.5rem', marginTop : '1.5rem'}}>
				<div className="card mb-2" style={{ maxWidth: 500, borderRadius: '0 !important'}} >
					<CarouselImages pictures={pictures} />
					<div className="card-body">
						<Container>
							<Row>
								<Card.Title>Your stats</Card.Title>
							</Row>
						</Container>
						<div className='p-2 d-flex justify-content-around'>
							<div>views {views}</div>
							<div>likes {likes}</div>
						</div>
						<div className="d-flex justify-content-around">
							{infoShow === false ? <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-down"/> : <motion.i whileHover={{ scale: 1.2 }} style={{cursor:'pointer'}} onClick={() => showHideInfo()} className="align-self-end fa-solid fa-chevron-up"></motion.i>}
						</div>
						{infoShow ? <List props={props}/> : null}
					</div>
				</div>
			</div>
		)
	}
	
}

export default Stats;