
import { useState } from "react";
import { Nav } from "react-bootstrap";
import './style/mennu.css';
import { motion } from "framer-motion";

const Links = ({handleClick, setShowHide, showHide}) => {
	const [hover1, setHover1] = useState(false);
	const [hover2, setHover2] = useState(false);
	const [hover3, setHover3] = useState(false);
	const [hover4, setHover4] = useState(false);
	const [hover5, setHover5] = useState(false);
	

	return (
		<div id="nav">
			<Nav defaultActiveKey="/home" className="flex-column  align-items-center ">
				<Nav.Link onMouseEnter={() => setHover1(true)} onMouseLeave={() => setHover1(false)} style={{borderTop: hover1 ? '1px solid #e6e6e6' : 'none', borderBottom: hover1 ? '1px solid #e6e6e6' : 'none' ,backgroundColor : hover1 ? 'rgb(237, 237, 237)' : 'white', color: 'black'}} onClick={() => handleClick(1, setShowHide, showHide)}>Profile</Nav.Link>
				<Nav.Link onMouseEnter={() => setHover2(true)} onMouseLeave={() => setHover2(false)} style={{borderTop: hover2 ? '1px solid #e6e6e6' : 'none', borderBottom: hover2 ? '1px solid #e6e6e6' : 'none' ,backgroundColor : hover2 ? 'rgb(237, 237, 237)' : 'white', color: 'black'}} onClick={() => handleClick(4, setShowHide, showHide)}>Edit Profile</Nav.Link>
				<Nav.Link onMouseEnter={() => setHover3(true)} onMouseLeave={() => setHover3(false)} style={{borderTop: hover3 ? '1px solid #e6e6e6' : 'none', borderBottom: hover3 ? '1px solid #e6e6e6' : 'none' ,backgroundColor : hover3 ? 'rgb(237, 237, 237)' : 'white', color: 'black'}} onClick={() => handleClick(2, setShowHide, showHide)}>Password</Nav.Link>
				<Nav.Link onMouseEnter={() => setHover4(true)} onMouseLeave={() => setHover4(false)} style={{borderTop: hover4 ? '1px solid #e6e6e6' : 'none', borderBottom: hover4 ? '1px solid #e6e6e6' : 'none' ,backgroundColor : hover4 ? 'rgb(237, 237, 237)' : 'white', color: 'black'}} onClick={() => handleClick(3, setShowHide, showHide)}>Edit Photos</Nav.Link>
				<Nav.Link onMouseEnter={() => setHover5(true)} onMouseLeave={() => setHover5(false)} style={{borderTop: hover5 ? '1px solid #e6e6e6' : 'none', borderBottom: hover5 ? '1px solid #e6e6e6' : 'none' ,backgroundColor : hover5 ? 'rgb(237, 237, 237)' : 'white', color: 'black'}} onClick={() => handleClick(5, setShowHide, showHide)}>Scores</Nav.Link>
			</Nav>
		</div>
)
}

const SettingsMenu = ({ handleClick }) => {
	const [showHide, setShowHide] = useState(false);
	const dropMenu = () => {
		setShowHide(!showHide);
	}

	return (
		<>
			<motion.div whileHover={{ scale: 1.4}} className="burger" onClick={() => dropMenu()}></motion.div>
			{showHide ? <Links 

				handleClick={handleClick}
				setShowHide={setShowHide}
				showHide={showHide} /> : null}
		</>
	)
}


export default SettingsMenu;
