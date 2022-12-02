import { useState, useContext } from "react";
import { Container } from "react-bootstrap";
import ProfileForm from "../components/settings/ProfileForm";
import PasswordForm from "../components/settings/PasswordForm";
import AddPhotos from "../components/completeAccountForms/AddPhotos";
import ProfileCard from "../components/ProfileCard";
import SettingsMenu from "../components/settingsMenu";
import { validator } from "../services/validator";
import LoginContext from "../contexts/loginContext";
import { useNavigate } from "react-router-dom";
import Stats from "../components/Stats";

const MyForm = ({containerToShow, login}) => {
	if (login === true) {
		if (containerToShow === 1)
			return (<ProfileCard target={'self'}/>)
		if (containerToShow === 2)
			return (<PasswordForm />)
		if (containerToShow === 3)
			return (<AddPhotos target={9} />)
		if (containerToShow === 4)
			return (<ProfileForm />)
		if (containerToShow === 5)
			return (<Stats target={'self'} />)

	}

}

export const ProfilePage = () => {
	const [login, setLogin] = useContext(LoginContext);
	validator().then((response) => {
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		}
		else {
			setLogin(true)
		}
	})
	const [containerToShow, setContainerToShow] = useState(1)

	const navigate = useNavigate();

	const handleClick = (value,  setShowHide, showHide) => {
		setShowHide(!showHide)
		setContainerToShow(value);
	}
		return (

				<Container id="nav-plus-form" style={{padding: 0}}>
					<div className="row justify-content-center p-0 m-0">
						<SettingsMenu  handleClick={handleClick} />
					</div>
					<div style={{
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
