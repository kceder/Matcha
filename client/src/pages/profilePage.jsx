import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import ProfileForm from "../components/settings/ProfileForm";
import PasswordForm from "../components/settings/PasswordForm";
import AddPhotos from "../components/completeAccountForms/AddPhotos";
import ProfileCard from "../components/ProfileCard";
import SettingsMenu from "../components/settingsMenu";


const MyForm = ({containerToShow}) => {

	if (containerToShow === 2)
		return (<PasswordForm />)
	if (containerToShow === 1)
		return (<ProfileCard target={'self'}/>)
	if (containerToShow === 4)
		return (<ProfileForm />)
	if (containerToShow === 3)
		return (<AddPhotos target={9} />)

}

export const ProfilePage = () => {

	const [containerToShow, setContainerToShow] = useState(1)

	const handleClick = (value) => {
		console.log(value)
		setContainerToShow(value);
	}

	return (

			<Container id="nav-plus-form">
				<div className="row row justify-content-center ">
					<SettingsMenu  handleClick={handleClick} />
				</div>
				<div className=" " >
					<MyForm containerToShow={containerToShow} ></MyForm>
				</div>
			</ Container>

	);
};
