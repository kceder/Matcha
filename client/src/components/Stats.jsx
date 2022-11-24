import React, { useState, useEffect } from "react";
import { getStats } from "../services/stats";

const Stats = ({ target }) => {
	const [views, setViews] = useState(0);
	const [likes, setLikes] = useState(0);
	const [rating, setRating] = useState(0);
	const [viewHistory, setViewHistory] = useState([]);
	const [likeHistory, setLikeHistory] = useState([]);
	const [blocks, setBlocks] = useState(0);
	const [matches, setMatches] = useState([]);
	const [done, setDone] = useState(false);
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
			setDone(true);
		})
	}, []);

	if (done === true) {
		return (
			// css centre text and add padding to the top and bottom of the container //
			<div className="container">
				<h3 style={{ textAlign : 'center' }}>Your stats</h3>
				<div className="row">
					<div className="col-6">
						<p>People viewed you {views} times!</p>
					</div>
					<div className="col-6">
						<p>People liked you {likes} times!</p>
					</div>
				</div>
				<div className="row">
					<div className="col-6">
						<p>People who viewed you:</p>
						<ul>
							{viewHistory.map((user, index) => {
								return (
									<li key={index}>{user.name}</li>
								)
							})}
						</ul>
					</div>
					<div className="col-6">
						<p>People who liked you:</p>
						<ul>
							{likeHistory.map((user, index) => {
								return (
									<li key={index}>{user.name}</li>
								)
							})}
						</ul>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<p>You have been blocked {blocks} times.</p>
					</div>
				</div>
			</div>
		)
	}
	
}

export default Stats;