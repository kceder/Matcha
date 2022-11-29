import PersonalDetailsForm from "../components/completeAccountForms/PersonalDetailsForm"
import { validator } from "../services/validator";
import { useNavigate } from "react-router-dom";

export const SetUpProfile = () => {
	const navigate = useNavigate();
	validator().then((response) => {
		console.log((response.data))
		if (response.data === 'token invalid' || response.data === 'no token') {
			navigate('/')
		}
	});
	return <PersonalDetailsForm />
}