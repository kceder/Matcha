import { useState, useContext } from "react";
import { Container, Nav } from "react-bootstrap";
import ProfileForm from "../components/settings/ProfileForm";
import PasswordForm from "../components/settings/PasswordForm";
import AddPhotos from "../components/completeAccountForms/AddPhotos";
import ProfileCard from "../components/ProfileCard";
import SettingsMenu from "../components/settingsMenu";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";

const MyForm = ({containerToShow, login}) => {
	if (login === true) {
		if (containerToShow === 2)
			return (<PasswordForm />)
		if (containerToShow === 1)
			return (<ProfileCard target={'self'}/>)
		if (containerToShow === 4)
			return (<ProfileForm />)
		if (containerToShow === 3)
			return (<AddPhotos target={9} />)

	}

}

export const ProfilePage = () => {
	const [login, setLogin] = useContext(LoginContext);
	validator().then((response) => {
		console.log((response.data))
		if (response.data === 'token invalid') {
			navigate('/')
		}
		else {
			setLogin(true)
		}
	})
	const [containerToShow, setContainerToShow] = useState(1)

	const navigate = useNavigate();

	const handleClick = (value) => {
		console.log(value)
		setContainerToShow(value);
	}

	
		console.log('login context in pp:', login);
		return (

				<Container id="nav-plus-form">
					<div className="row row justify-content-center ">
						<SettingsMenu  handleClick={handleClick} />
					</div>
					<div className="" style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
					}}>
						<MyForm login={login} containerToShow={containerToShow} ></MyForm>
					</div>
				</ Container>

		);
};
