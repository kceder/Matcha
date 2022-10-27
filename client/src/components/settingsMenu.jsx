
import { useState } from "react";
import { Nav } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import './style/mennu.css';

const Links = ({handleClick}) => {
    return (
        <div id="nav" className="col-md-2 col-sm-12">
                <Nav defaultActiveKey="/home" className="flex-column  align-items-center ">
                    <Nav.Link onClick={() => handleClick(1)}>Profile</Nav.Link>
                    <Nav.Link onClick={() => handleClick(4)}>Edit Profile</Nav.Link>
                    <Nav.Link onClick={() => handleClick(2)}>Password</Nav.Link>
                    <Nav.Link onClick={() => handleClick(3)}>Edit Photos</Nav.Link>
                    <Nav.Link onClick={() => handleClick(5)}>Scores</Nav.Link>
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
            {showHide ? <Links handleClick={handleClick} /> : null}
        </>
    )
}


export default SettingsMenu;
