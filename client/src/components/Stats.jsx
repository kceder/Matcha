import React, { useState, useEffect } from "react";
import { getStats } from "../services/stats";
import { getUserPhotos } from "../services/photos";

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

	useEffect(() => {
		getStats({target : target}).then(response => {
			console.log('hereghdugvkjfdvhfbdj')
			console.log(response.data);
			setViews(response.data.views);
			setLikes(response.data.likes);
			setViewHistory(JSON.parse(response.data.view_history));
			setLikeHistory(JSON.parse(response.data.like_history));
			setBlocks(response.data.block);
			setMatches(JSON.parse(response.data.matches));
		}).then(() => {
			getUserPhotos({target : target}).then(response => {
				console.log(response.data);
				setProfilePic(response.data.pic_1);
			})
			setDone(true);
		})
	}, []);

	if (done === true) {
		return (
			// css centre text and add padding to the top and bottom of the container //
			<div className="container mt-3">
				<h3 style={{ textAlign : 'center' }}>Your stats</h3>
				<div className="row" style={{border : '2px solid black', textAlign : 'center'}}>
					<div className="col-12" >
						<p>{views} people viewed you:</p>
						<div className="mb-3" style={{ maxHeight : '120px', overflowY : 'scroll'}}>
							{viewHistory.map((user, index) => {
								return (
									<div key={index}>
										<small>{user.name}</small><br></br>
									</div>
								)
							})}
							</div>
					</div>
				</div>
				<div className="row mt-3" style={{ textAlign : 'center', border : '2px solid black'}} >
					<div className="col-12">
						<p>{likes} people  liked you:</p>
						<div className="mb-3" style={{ maxHeight : '120px', overflowY : 'scroll'}}>
							{likeHistory.map((user, index) => {
								return (
									<div key={index}>
										<small>{user.name}</small><br></br>
									</div>
								)
							})}
							</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12 mt-2" style={{ textAlign : 'center', border : '2px solid black'}}>
						<p>You have been blocked {blocks} times.</p>
					</div>
				</div>
			</div>
		)
	}
	
}

export default Stats;