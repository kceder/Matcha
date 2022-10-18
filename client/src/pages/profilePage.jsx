import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import ProfileForm from "../components/settings/ProfileForm";
import PasswordForm from "../components/settings/PasswordForm";

const Form = ({containerToShow}) => {

	if (containerToShow === 2)
		return (<PasswordForm />)
	if (containerToShow === 1)
		return (<ProfileForm />)

}

export const ProfilePage = () => {

	const [containerToShow, setContainerToShow] = useState(1)

	const handleClick = (value) => {
		console.log(value)
		setContainerToShow(value);
	}

	return (

			<Container id="nav-plus-form">
				<div className="row">
					<div id="nav" className="col-md-2 col-sm-12 bg-danger">
						<Nav defaultActiveKey="/home" className="flex-column  align-items-center ">
							<Nav.Link onClick={() => handleClick(1)}>Profile</Nav.Link>
							<Nav.Link onClick={() => handleClick(2)}>Password</Nav.Link>
							<Nav.Link onClick={() => handleClick(3)}>Scores</Nav.Link>
						</Nav>
					</ div>
					<div className="col" >
						<Form containerToShow={containerToShow} ></Form>
					</div>
				</div>
			</ Container>

	);
};
