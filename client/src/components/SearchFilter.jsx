import { useState } from "react";
import MultiRangeSlider from "multi-range-slider-react";
import TagsSelector from "./TagsSelector";
import './style/slider.css';
import { filterUsers } from "../services/users";
import StarInput from "./StarInput";
import './style/slider.css'
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";


const SearchForm = ({states, dropMenu}) => {

	const handleSubmit = (event) => {
		event.preventDefault();
		const filters = {
			distance: states.distance,
			minAge: states.minAge,
			maxAge: states.maxAge,
			tags: states.tags,
			gender: states.gender,
			preference: states.preference,
			userLocation: states.location,
			rating: states.stars * 10,
		}
		filterUsers(filters).then(response => {
			states.setUsers(response.data);
		})
		dropMenu();
	}

	const handleAgeChange = (e) => {
		states.setMinAge(e.minValue);
		states.setMaxAge(e.maxValue);
	};
	return (
		<div style={{width : '95%', maxWidth : '500px'}}>
			<form>
				<label>Age </label> <small> {states.minAge} - {states.maxAge}</small>
				<MultiRangeSlider
					min={18}
					max={65}
					step={1}
					minValue={states.minAge}
					maxValue={states.maxAge}
					ruler={false}
					style={{ border: "none", boxShadow: "none" }}
					barLeftColor="white"
					barInnerColor="black"
					barRightColor="white"
					onInput={(e) => {
						handleAgeChange(e);
					}}
				/>
				<label className="mt-2">Distance</label> <small>{states.distance} km</small><br></br>
				<input type="range" min="0" max="1000" value={states.distance} onChange={(e) => {states.setDistance(e.target.value)}}></input><br></br>
				<label>Tags</label>
				<TagsSelector setInterests={states.setTags} interests={states.tags} tags={states.allTags}/>
				<div className="d-flex justify-content-between align-items-center">
					<div><small>Minimum rating</small><StarInput chosenStars={states.stars} setChosenStars={states.setStars}/></div>
					<Button variant="outline-dark" type="submit" onClick={(event) => handleSubmit(event)}>Filter</Button>
				</div>
			</form>
			
		</div>
	)
}

const SearchFilter = ({states}) => {

		const [showHide, setShowHide] = useState(false);
	
		const dropMenu = () => {
			setShowHide(!showHide);
		}
		return (
			<>
				<motion.div whileHover={{ scale: 1.4}} className="burger" onClick={() => dropMenu()}></motion.div>
				{showHide ? <> <SearchForm dropMenu={dropMenu} className="bg-alert" states={states}/> </> : null}
			</>
		)
}

export default SearchFilter;