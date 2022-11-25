import React, { useState, useEffect } from "react";
import { getStats } from "../services/stats";
import { getUserPhotos } from "../services/photos";

const List = ({ list }) => {

	return (
		<div >
			lol
		</div>
	);
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
			<div>
				<List list={viewHistory}/>
				<div className="container mt-3">
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="card-body">
									<div className="row">
										<div className="col-12">
											<h3 className="text-center">*****</h3>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="row">
												<div className="col-12">
													<img src={profilePic} alt="profile pic" className="img-fluid" />
												</div>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="row">
												<div className="col-12">
													<h5 style={{ textDecoration : 'underline' }} className="text-center mt-3">{views} Views</h5>
												</div>
											</div>
											<div className="row">
												<div className="col-12">
													<p className="text-center"></p>
												</div>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="row">
												<div className="col-12">
													<h5 style={{ textDecoration : 'underline' }} className="text-center">{likes} Likes</h5>
												</div>
											</div>
											<div className="row">
												<div className="col-12">
													<p className="text-center"></p>
												</div>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="row">
												<div className="col-12">
													<h5 style={{ textDecoration : 'underline' }} className="text-center">{blocks} Blocks</h5>
												</div>
											</div>
											<div className="row">
												<div className="col-12">
													<p className="text-center"></p>
												</div>
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<div className="row">
												<div className="col-12">
													<h5 style={{ textDecoration : 'underline' }} className="text-center">Matches</h5>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	
}

export default Stats;