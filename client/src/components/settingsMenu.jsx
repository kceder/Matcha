
import { useState } from "react";
import { Nav } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import './style/mennu.css';

const Links = ({handleClick, setShowHide, showHide}) => {
    return (
        <div id="nav" className="">
                <Nav defaultActiveKey="/home" className="flex-column  align-items-center ">
                    <Nav.Link style={{color: 'black'}} onClick={() => handleClick(1, setShowHide, showHide)}>Profile</Nav.Link>
                    <Nav.Link style={{color: 'black'}} onClick={() => handleClick(4, setShowHide, showHide)}>Edit Profile</Nav.Link>
                    <Nav.Link style={{color: 'black'}} onClick={() => handleClick(2, setShowHide, showHide)}>Password</Nav.Link>
                    <Nav.Link style={{color: 'black'}} onClick={() => handleClick(3, setShowHide, showHide)}>Edit Photos</Nav.Link>
                    <Nav.Link style={{color: 'black'}} onClick={() => handleClick(5, setShowHide, showHide)}>Scores</Nav.Link>
                </Nav>
            </ div>
    )
}

const SettingsMenu = ({ handleClick }) => {
	const [showHide, setShowHide] = useState(false);

	const dropMenu = () => {
		setShowHide(!showHide);
	}
	return (
		<>
			<div className="burger" onClick={() => dropMenu()}></div>
			{showHide ? <Links handleClick={handleClick} setShowHide={setShowHide} showHide={showHide} /> : null}
		</>
	)
}


export default SettingsMenu;
