import { useState } from "react";

const StarInput = ({chosenStars, setChosenStars}) => {

	const [stars, setStars] = useState(0);


	const handleEnter = (e) => {
		setStars(e.target.attributes.value.value)
	}
	const handleLeave = (e) => {
		setStars(0);
	}

	const handleClick = (e) => {
		setChosenStars(e.target.attributes.value.value);
	}

	return (
		<div>
			<i value='1' style={{cursor:'pointer'}} onClick={(e) => handleClick(e)} onMouseLeave={(e) => handleLeave(e)} onMouseEnter={(e) => handleEnter(e) } className={chosenStars > 0 ? "fa-solid fa-star" : (stars > 0 ? "fa-solid fa-star" : "fa-regular fa-star")}></i>
			<i value='2' style={{cursor:'pointer'}} onClick={(e) => handleClick(e)} onMouseLeave={(e) => handleLeave(e)} onMouseEnter={(e) => handleEnter(e) } className={chosenStars > 1 ? "fa-solid fa-star" : (stars > 1 ? "fa-solid fa-star" : "fa-regular fa-star")}></i>
			<i value='3' style={{cursor:'pointer'}} onClick={(e) => handleClick(e)} onMouseLeave={(e) => handleLeave(e)} onMouseEnter={(e) => handleEnter(e) } className={chosenStars > 2 ? "fa-solid fa-star" : (stars > 2 ? "fa-solid fa-star" : "fa-regular fa-star")}></i>
			<i value='4' style={{cursor:'pointer'}} onClick={(e) => handleClick(e)} onMouseLeave={(e) => handleLeave(e)} onMouseEnter={(e) => handleEnter(e) } className={chosenStars > 3 ? "fa-solid fa-star" : (stars > 3 ? "fa-solid fa-star" : "fa-regular fa-star")}></i>
			<i value='5' style={{cursor:'pointer'}} onClick={(e) => handleClick(e)} onMouseLeave={(e) => handleLeave(e)} onMouseEnter={(e) => handleEnter(e) } className={chosenStars > 4 ? "fa-solid fa-star" : (stars > 4 ? "fa-solid fa-star" : "fa-regular fa-star")}></i>
		</div>
	)

};

export default StarInput;